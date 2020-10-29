import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
  ServerError,
  ServerParseError,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { buildDelayFunction, DelayFunction } from '@apollo/client/link/retry/delayFunction';
import { buildRetryFunction, RetryFunction } from '@apollo/client/link/retry/retryFunction';
import { ExecutionResult, GraphQLError } from 'graphql';
import * as jsonDiffPatch from 'jsondiffpatch';

import { deepMerge, RetryableOperation } from './utils';

// export const MergeLink = () => {
//   // const { delay, attempts } = options;
//   return new RetryLink({
//     // delay,
//     attempts: {
//       // ...attempts,
//       retryIf: (error, operation, data) => {
//         console.log(data);
//         console.log(error.data);
//         console.log(operation);
//         // return operation.operationName !== 'UpdateProject';
//         // console.log(_operation);
//         return true;
//       },
//     },
//   });
// };

// export const MergeLink = () =>
//   new ApolloLink((operation, forward) => {
//     // console.log(operation);
//     const { operationName, variables } = operation;
//     return forward(operation).map((response) => {
//       // console.warn(response);

//       const haveErrorMerge =
//         operationName === 'UpdateProject' &&
//         response.data?.updateProject &&
//         response.data?.updateProject &&
//         response.data?.updateProject.message ===
//           'Local and remote versions do not match. Check for conflicts and make merge.';

//       // if (haveErrorMerge) {
//       //   throw new Error('Конфликт');
//       // }

//       return response;
//     });
//   });

type HandlerParams = {
  response?: ExecutionResult;
  operation: Operation;
  forward: NextLink;
  graphQLErrors?: ReadonlyArray<GraphQLError>;
  networkError?: Error | ServerError | ServerParseError;
};

// const errorMergeHandler = (params: HandlerParams) =>
//   new Observable((observer) => {
//     const { operation, response, forward } = params;
//     const { variables } = operation;
//     const { remoteProject } = response.data?.updateProject;

//     const diff = jsonDiffPatch.diff(remoteProject, variables);

//     console.log('do ', diff);
//     if (diff) {
//       console.log('posle ', diff);
//       const patchedVars = {
//         ...jsonDiffPatch.patch(variables, diff),
//         version: remoteProject.version,
//       };

//       return forward({ ...operation, variables: patchedVars }).subscribe({
//         next: observer.next.bind(observer),
//         error: observer.error.bind(observer),
//         complete: observer.complete.bind(observer),
//       });
//     }

//     // если другая ошибка
//     observer.next(params.response);
//     observer.complete();
//   });

// export const MergeLink = ({ count }) =>
//   new ApolloLink((operation, forward) => {
//     // console.log(operation);
//     return new Observable((observer) => {
//       let sub: any;
//       let retriedSub: any;
//       let retriedResult: any;

//       try {
//         sub = forward(operation).subscribe({
//           next: (response) => {
//             const haveErrorMerge =
//               response.data?.updateProject &&
//               response.data?.updateProject.message ===
//                 'Local and remote versions do not match. Check for conflicts and make merge.';

//             if (haveErrorMerge) {
//               retriedResult = errorMergeHandler({
//                 response,
//                 operation,
//                 forward,
//                 graphQLErrors: response.errors,
//               }); // проверить подписку условия без условия

//               if (retriedResult) {
//                 retriedSub = retriedResult.subscribe({
//                   next: observer.next.bind(observer),
//                   error: observer.error.bind(observer),
//                   complete: observer.complete.bind(observer),
//                 });
//                 return;
//               }
//             }
//             observer.next(response);
//           },
//           error: (networkError) => {
//             retriedResult = errorMergeHandler({
//               operation,
//               networkError,
//               // Network errors can return GraphQL errors on for example a 403
//               graphQLErrors: networkError && networkError.result && networkError.result.errors,
//               forward,
//             });
//             if (retriedResult) {
//               retriedSub = retriedResult.subscribe({
//                 next: observer.next.bind(observer),
//                 error: observer.error.bind(observer),
//                 complete: observer.complete.bind(observer),
//               });
//               return;
//             }
//             observer.error(networkError);
//           },
//           complete: () => {
//             // disable the previous sub from calling complete on observable
//             // if retry is in flight.
//             if (!retriedResult) {
//               observer.complete.bind(observer)();
//             }
//           },
//         });
//       } catch (e) {
//         errorMergeHandler({ networkError: e, operation, forward });
//         observer.error(e);
//       }

//       return () => {
//         if (sub) sub.unsubscribe();
//         if (retriedSub) retriedSub.unsubscribe();
//       };
//     });
//   });

export class MergeLink extends ApolloLink {
  private delayFor: DelayFunction;

  private retryIf: RetryFunction;

  constructor(options?: RetryLink.Options) {
    super();
    const { attempts, delay } = options || ({} as RetryLink.Options);
    this.delayFor = typeof delay === 'function' ? delay : buildDelayFunction(delay);
    this.retryIf = typeof attempts === 'function' ? attempts : buildRetryFunction(attempts);
  }

  public request(operation: Operation, nextLink: NextLink): Observable<FetchResult> {
    const retryable = new RetryableOperation({
      operation,
      nextLink,
      delayFor: this.delayFor,
      retryIf: this.retryIf,
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
