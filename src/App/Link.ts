import { ApolloLink, FetchResult, NextLink, Observable, Operation } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { buildDelayFunction, DelayFunction } from '@apollo/client/link/retry/delayFunction';

import { RetryableOperation } from './utils';

export class MergeLink extends ApolloLink {
  private delayFor: DelayFunction;

  private attemptsMax: number;

  constructor(options?: RetryLink.Options) {
    super();
    const { attempts, delay } = options || ({} as RetryLink.Options);
    this.attemptsMax = typeof attempts === 'function' || !attempts?.max ? 5 : attempts?.max;
    this.delayFor = typeof delay === 'function' ? delay : buildDelayFunction(delay);
  }

  public request(operation: Operation, nextLink: NextLink): Observable<FetchResult> {
    const retryable = new RetryableOperation({
      operation,
      nextLink,
      delayFor: this.delayFor,
      maxAttempts: this.attemptsMax,
    });
    retryable.start();

    return new Observable((observer) => {
      retryable.subscribe(observer);
      return () => {
        retryable.unsubscribe(observer);
      };
    });
  }
}
