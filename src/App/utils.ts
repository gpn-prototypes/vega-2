import { NextLink, Operation } from '@apollo/client';
import { DelayFunction } from '@apollo/client/link/retry/delayFunction';
import { RetryFunction } from '@apollo/client/link/retry/retryFunction';
import * as jsonDiffPatch from 'jsondiffpatch';

export function deepMerge(...objects: Record<string, unknown>[]) {
  const isObject = (obj: unknown) => obj && typeof obj === 'object';

  function deepMergeInner(target: Record<string, unknown>, source: Record<string, unknown>) {
    Object.keys(source).forEach((key: string) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      console.log({ targetValue, sourceValue });

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMergeInner({ ...targetValue }, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  if (objects.length < 2) {
    throw new Error('deepMerge: this function expects at least 2 objects to be provided');
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('deepMerge: all values should be of type "object"');
  }

  const target = objects.shift();
  let source: Record<string, unknown> | undefined;

  while ((source = objects.shift())) {
    deepMergeInner(target, source);
  }

  return target;
}

type RetryableOperationOptions = {
  operation: Operation;
  nextLink: NextLink;
  delayFor: DelayFunction;
  retryIf: RetryFunction;
};

type Project = {
  id: number;
  name: string;
  status: string;
  description: string;
  version: number;
};

type ErrorProjectDiff = {
  code: string;
  message: string;
  remoteProject: Project;
  localProject: Project;
};

export class RetryableOperation<TValue = any> {
  private retryCount = 0;

  private values: any[] = [];

  private error: any;

  private complete = false;

  private canceled = false;

  private observers: (ZenObservable.Observer<TValue> | null)[] = [];

  private currentSubscription: ZenObservable.Subscription | null = null;

  private timerId: number | undefined;

  private operation: Operation;

  private nextLink: NextLink;

  private delayFor: DelayFunction;

  private retryIf: RetryFunction;

  constructor(options: RetryableOperationOptions) {
    const { operation, nextLink, delayFor, retryIf } = options;

    this.operation = operation;
    this.nextLink = nextLink;
    this.delayFor = delayFor;
    this.retryIf = retryIf;
  }

  /**
   * Register a new observer for this operation.
   *
   * If the operation has previously emitted other events, they will be
   * immediately triggered for the observer.
   */
  public subscribe(observer: ZenObservable.Observer<TValue>) {
    if (this.canceled) {
      throw new Error(`Subscribing to a retryable link that was canceled is not supported`);
    }
    this.observers.push(observer);

    // If we've already begun, catch this observer up.
    for (const value of this.values) {
      observer.next!(value);
    }

    if (this.complete) {
      observer.complete!();
    } else if (this.error) {
      observer.error!(this.error);
    }
  }

  /**
   * Remove a previously registered observer from this operation.
   *
   * If no observers remain, the operation will stop retrying, and unsubscribe
   * from its downstream link.
   */
  public unsubscribe(observer: ZenObservable.Observer<TValue>) {
    const index = this.observers.indexOf(observer);
    if (index < 0) {
      throw new Error(`RetryLink BUG! Attempting to unsubscribe unknown observer!`);
    }
    // Note that we are careful not to change the order of length of the array,
    // as we are often mid-iteration when calling this method.
    this.observers[index] = null;

    // If this is the last observer, we're done.
    if (this.observers.every((o) => o === null)) {
      this.cancel();
    }
  }

  /**
   * Start the initial request.
   */
  public start() {
    if (this.currentSubscription) return; // Already started.

    this.try();
  }

  /**
   * Stop retrying for the operation, and cancel any in-progress requests.
   */
  public cancel() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
    clearTimeout(this.timerId);
    this.timerId = undefined;
    this.currentSubscription = null;
    this.canceled = true;
  }

  private try() {
    this.currentSubscription = this.nextLink(this.operation).subscribe({
      next: this.onNext,
      error: this.onError,
      complete: this.onComplete,
    });
  }

  private onNext = (value: any) => {
    const haveErrorDiff = value.data.updateProject.code === 'ERROR_DIFF';

    console.log(value);

    if (haveErrorDiff) {
      this.onError(value.data.updateProject);
      return;
    }
    this.values.push(value);

    for (const observer of this.observers) {
      if (!observer) continue;
      observer.next!(value);
    }
  };

  private onComplete = () => {
    this.complete = true;
    for (const observer of this.observers) {
      if (!observer) continue;
      observer.complete!();
    }
  };

  private onError = async (error: ErrorProjectDiff) => {
    this.retryCount += 1;

    // Should we retry?
    // const shouldRetry = await this.retryIf(this.retryCount, this.operation, error);

    const shouldRetry = error.code === 'ERROR_DIFF';

    if (shouldRetry) {
      // const { variables } = this.operation;
      // const { remoteProject } = error;
      // const diff = jsonDiffPatch.diff(remoteProject, variables);

      // if (diff) {
      //   const patchedVars = {
      //     ...jsonDiffPatch.patch(variables, diff),
      //     version: remoteProject.version,
      //   };

      //   this.operation = { ...this.operation, variables: patchedVars };
      // }

      this.scheduleRetry(this.delayFor(this.retryCount, this.operation, error));
      return;
    }

    this.error = error;
    for (const observer of this.observers) {
      if (!observer) continue;
      observer.error!(error);
    }
  };

  private scheduleRetry(delay: number) {
    if (this.timerId) {
      throw new Error(`RetryLink BUG! Encountered overlapping retries`);
    }

    this.timerId = (setTimeout(() => {
      this.timerId = undefined;
      this.try();
    }, delay) as any) as number;
  }
}
