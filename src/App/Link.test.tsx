import { nextTick } from 'process';

import { ApolloLink, execute, fromError, Observable, throwServerError } from '@apollo/client';
import { waitFor } from '@testing-library/react';

import waitForObservables from '../utils/test-utils/wait-for-observable';

import {
  CREATE_USER_MUTATION,
  GET_PROJECT_QUERY,
  mutationCreateUserData,
  mutationCreateUserVariable,
  mutationUpdateProjectData,
  mutationUpdateProjectErrorData,
  mutationUpdateProjectErrorData3,
  mutationUpdateProjectMergedVariable,
  mutationUpdateProjectVariable,
  mutationUpdateUserData,
  mutationUpdateUserVariable,
  mutationValidationErrorData,
  queryData,
  UPDATE_PROJECT_MUTATION,
  UPDATE_USER_MUTATION,
} from './__mocks__/link.mock';
import { MergeLink } from './Link';

const standardError = new Error('I never work');

describe('RetryLink', () => {
  it.only('fails for unreachable endpoints', async () => {
    const max = 10;
    const retry = new MergeLink({ delay: { initial: 1 }, attempts: { max } });
    const stub = jest.fn(() => Observable.of(mutationUpdateProjectErrorData)) as any;
    // const stub = jest.fn(() => fromError(standardError)) as any;
    const link = ApolloLink.from([retry, stub]);

    const [resultWithError] = (await waitForObservables(
      execute(link, { query: UPDATE_PROJECT_MUTATION, variables: mutationUpdateProjectVariable }),
    )) as any;

    // expect(resultWithError.values).toEqual([mutationUpdateProjectErrorData]);
    expect(stub).toHaveBeenCalledTimes(max);
  });

  it('возвращается ответ при query', async () => {
    const retry = new MergeLink();
    const stub = jest.fn(() => Observable.of(queryData));
    const link = ApolloLink.from([retry, stub]);

    const [{ values }] = (await waitForObservables(
      execute(link, { query: GET_PROJECT_QUERY }),
    )) as any;

    expect(values).toEqual([queryData]);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('возвращается ответ при mutation', async () => {
    const retry = new MergeLink();
    const stub = jest.fn(() => Observable.of(mutationUpdateProjectData));
    const link = ApolloLink.from([retry, stub]);

    const [{ values }] = (await waitForObservables(
      execute(link, { query: UPDATE_PROJECT_MUTATION, variables: mutationUpdateProjectVariable }),
    )) as any;

    expect(values).toEqual([mutationUpdateProjectData]);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('возвращается ошибка о конфликте версий и решение конфликта', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mutationUpdateProjectErrorData))
      // .mockImplementationOnce(() => Observable.of(mutationUpdateProjectErrorData3))
      .mockImplementationOnce(() => Observable.of(mutationUpdateProjectData));

    const link = ApolloLink.from([retry, stub]);

    const [resultWithSuccess] = (await waitForObservables(
      execute(link, { query: UPDATE_PROJECT_MUTATION, variables: mutationUpdateProjectVariable }),
    )) as any;

    // expect(resultWithError.values).toEqual([mutationUpdateProjectErrorData]);
    // expect(resultWithSuccess.values).toEqual([mutationUpdateProjectData]);
    expect(stub).toHaveBeenCalledTimes(2);
  });

  // ??? уточнить ценность теста
  it('возвращается ошибка валидации', async () => {
    const response = { status: 400, ok: false } as Response;
    const retry = new MergeLink({ delay: { initial: 1 }, attempts: { max: 2 } });
    const stub = jest.fn(() =>
      throwServerError(response, mutationValidationErrorData, 'validation error'),
    ) as any;
    const link = ApolloLink.from([retry, stub]);

    const [{ error }] = (await waitForObservables(
      execute(link, { query: UPDATE_PROJECT_MUTATION, variables: mutationUpdateProjectVariable }),
    )) as any;

    expect(error.result).toEqual(mutationValidationErrorData);
    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('при нескольких запущенных мутациях, обрабатывается только обновление проекта', async () => {
    const retry = new MergeLink();
    const stub = jest
      .fn()
      .mockImplementationOnce(() => Observable.of(mutationCreateUserData))
      .mockImplementationOnce(() => Observable.of(mutationUpdateProjectErrorData))
      .mockImplementationOnce(() => Observable.of(mutationUpdateProjectData))
      .mockImplementationOnce(() => Observable.of(mutationUpdateUserData));
    const link = ApolloLink.from([retry, stub]);

    const t = (await waitForObservables(
      execute(link, { query: CREATE_USER_MUTATION, variables: mutationCreateUserVariable }),
      execute(link, { query: UPDATE_PROJECT_MUTATION, variables: mutationUpdateProjectVariable }),
      execute(link, { query: UPDATE_USER_MUTATION, variables: mutationUpdateUserVariable }),
    )) as any;

    console.log(t[1].values);

    // expect(values).toEqual([mutationUpdateProjectData]);
    expect(stub).toHaveBeenCalledTimes(4);
  });
});
