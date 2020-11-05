import { ApolloLink, execute, fromError, Observable, throwServerError } from '@apollo/client';

import waitForObservables from '../utils/test-utils/wait-for-observable';

import * as mock from './__mocks__/link.mock';
import { MergeLink } from './Link';

const standardError = new Error('I never work');

describe('MergeLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('при ошибке конфликта запрос повторяется указанное кол-во раз', async () => {
    const max = 10;
    const retry = new MergeLink({ delay: { initial: 1 }, attempts: { max } });
    const stub = jest.fn(() => Observable.of(mock.mutationUpdateProjectErrorData)) as any;
    const link = ApolloLink.from([retry, stub]);

    const [resultWithError] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(resultWithError.error).toEqual(mock.mutationUpdateProjectErrorData);
    expect(stub).toHaveBeenCalledTimes(max);
  });

  it('по умолчанию совершается 5 запросов при ошибке', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData));
    const link = ApolloLink.from([retry, stub]);

    const [resultWithError] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(resultWithError.error).toEqual(mock.mutationUpdateProjectErrorData);
    expect(stub).toHaveBeenCalledTimes(5);
  });

  it('возвращается ответ при query', async () => {
    const retry = new MergeLink();
    const stub = jest.fn(() => Observable.of(mock.queryData));
    const link = ApolloLink.from([retry, stub]);

    const [{ values }] = (await waitForObservables(
      execute(link, { query: mock.GET_PROJECT_QUERY }),
    )) as any;

    expect(values).toEqual([mock.queryData]);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('возвращается ответ при mutation', async () => {
    const retry = new MergeLink();
    const stub = jest.fn(() => Observable.of(mock.mutationUpdateProjectData));
    const link = ApolloLink.from([retry, stub]);

    const [{ values }] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(values).toEqual([mock.mutationUpdateProjectData]);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('возвращается ошибка о конфликте версий и решение конфликта', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData3))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectData3));

    const link = ApolloLink.from([retry, stub]);

    const [resultWithSuccess] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(resultWithSuccess.values).toEqual([mock.mutationUpdateProjectData3]);
    expect(stub).toHaveBeenCalledTimes(3);
  });

  // ??? уточнить ценность теста после обновления схемы с ошибками
  it.skip('возвращается ошибка валидации', async () => {
    const response = { status: 400, ok: false } as Response;
    const retry = new MergeLink({ attempts: { max: 2 } });
    const stub = jest.fn(() =>
      throwServerError(response, mock.mutationValidationErrorData, 'validation error'),
    ) as any;
    const link = ApolloLink.from([retry, stub]);

    const [{ error }] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(error.result).toEqual(mock.mutationValidationErrorData);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('возвращается обычная ошибка', async () => {
    const retry = new MergeLink({ attempts: { max: 2 } });
    const stub = jest.fn(() => fromError(standardError)) as any;
    const link = ApolloLink.from([retry, stub]);

    const [{ error }] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
    )) as any;

    expect(error).toEqual(standardError);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('при нескольких запущенных мутациях, обрабатывается только обновление проекта', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mock.mutationCreateUserData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateUserData));
    const link = ApolloLink.from([retry, stub]);

    const [createUserResult, updateUserResult, updateProjectResult] = (await waitForObservables(
      execute(link, {
        query: mock.CREATE_USER_MUTATION,
        variables: mock.mutationCreateUserVariable,
      }),
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
      execute(link, {
        query: mock.UPDATE_USER_MUTATION,
        variables: mock.mutationUpdateUserVariable,
      }),
    )) as any;

    expect(updateProjectResult.values).toEqual([mock.mutationUpdateProjectData]);
    expect(stub).toHaveBeenCalledTimes(4);
  });

  it.skip('мутации склеиваются в 1 при ожидании завершения запущенной', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectErrorData3))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectData3))
      .mockImplementationOnce(() => Observable.of(mock.mutationUpdateProjectDataStitched));

    const link = ApolloLink.from([retry, stub]);

    const [first, second, third] = (await waitForObservables(
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariable,
      }),
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariableDescriptionForStitch,
      }),
      execute(link, {
        query: mock.UPDATE_PROJECT_MUTATION,
        variables: mock.mutationUpdateProjectVariableNameForStitch,
      }),
    )) as any;

    expect(first.values).toEqual([mock.mutationUpdateProjectDataStitched]);
    expect(stub).toHaveBeenCalledTimes(4);
  });
});
