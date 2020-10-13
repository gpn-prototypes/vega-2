import { QueryWithMerge } from './query-with-merge';

type ProjectList = Record<string, unknown>;

const PROJECT_1 = {
  id: 1,
  name: 'Project 1',
  description: 'Description 1',
};

const PROJECT_2 = {
  id: 2,
  name: 'Project 2',
  description: 'Description 2',
};

function query(): Promise<ProjectList> {
  return new Promise((resolve) => {
    process.nextTick(() => {
      resolve(PROJECT_1);
    });
  });
}

function mutation({ id }: Record<string, unknown>): Promise<ProjectList> {
  return new Promise((resolve) => {
    process.nextTick(() => {
      resolve({
        id,
      });
    });
  });
}

describe('QueryWithMerge', () => {
  const queryWithMerge = new QueryWithMerge({ query, mutation });

  test.todo('отправляются данные при update');
  test.todo('отменяется подписка destroy');
});
