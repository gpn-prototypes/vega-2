import { NextLink, Operation } from '@apollo/client';
import { DelayFunction } from '@apollo/client/link/retry/delayFunction';
import * as jsonDiffPatch from 'jsondiffpatch';

type RetryableOperationOptions = {
  operation: Operation;
  nextLink: NextLink;
  delayFor: DelayFunction;
  maxAttempts: number;
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

  private shouldComplete: boolean;

  private isMergeInProgress: boolean;

  readonly maxAttempts: number;

  private operationInQueue: Operation | null;

  constructor(options: RetryableOperationOptions) {
    const { operation, nextLink, delayFor, maxAttempts } = options;

    this.operation = operation;
    this.nextLink = nextLink;
    this.delayFor = delayFor;
    this.shouldComplete = false;
    this.maxAttempts = maxAttempts;
    this.isMergeInProgress = false;

    this.operationInQueue = null;
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
    this.values.forEach((value) => {
      observer.next!(value);
    });

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

  private mergeOperations(operation: Operation) {
    if (!this.operationInQueue) {
      this.operationInQueue = operation;
      return;
    }

    const { variables } = operation;

    this.operationInQueue = {
      ...this.operationInQueue,
      variables: { ...this.operationInQueue, ...variables },
    };
  }

  private try() {
    // if (this.isMergeInProgress) {
    //   console.log(this.operation);
    //   this.mergeOperations(this.operation);
    // } else {
    //   if (this.operationInQueue) {
    //     this.operation = this.operationInQueue;
    //   }

    //   this.operationInQueue = null;
    // }

    this.currentSubscription = this.nextLink(this.operation).subscribe({
      next: this.onNext,
      error: this.onError,
      complete: this.onComplete,
    });
  }

  private onNext = (value: any) => {
    const haveErrorDiff = !value.errors && value.data.updateProject?.code === 'ERROR_DIFF';
    const isNeedMerge = this.retryCount < this.maxAttempts && haveErrorDiff;

    if (isNeedMerge) {
      this.isMergeInProgress = true;
      this.shouldComplete = false;
      this.onDiffError(value);
      return;
    }

    this.shouldComplete = true;
    this.isMergeInProgress = false;
    this.values.push(value);

    this.observers.forEach((observer) => {
      if (!observer) return;
      observer.next!(value);
    });
  };

  private onComplete = () => {
    if (!this.shouldComplete) {
      return;
    }

    this.complete = true;

    this.observers.forEach((observer) => {
      if (!observer) return;
      observer.complete!();
    });
  };

  private onDiffError = (error) => {
    this.retryCount += 1;
    const shouldRetry = error.data.updateProject.code === 'ERROR_DIFF';

    if (this.retryCount < this.maxAttempts && shouldRetry) {
      const { variables } = this.operation;
      const { remoteProject } = error.data.updateProject;
      const diff = jsonDiffPatch.diff(remoteProject, variables);

      if (diff) {
        const patchedVars = {
          ...jsonDiffPatch.patch(variables, diff),
          version: remoteProject.version,
        };

        this.operation = { ...this.operation, variables: patchedVars };
      }

      this.scheduleRetry(this.delayFor(this.retryCount, this.operation, error));
      return;
    }

    this.observers.forEach((observer) => {
      if (!observer) return;
      observer.error!(error);
    });
  };

  private onError = async (error: any) => {
    this.error = error;
    this.observers.forEach((observer) => {
      if (!observer) return;
      observer.error!(error);
    });
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
