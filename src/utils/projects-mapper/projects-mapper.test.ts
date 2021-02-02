import { ProjectStatusEnum } from '../../__generated__/types';
import { ProjectsTableList } from '../../pages/projects/__generated__/projects';

import { projectsMapper } from './projects-mapper';

const mockedData: ProjectsTableList = {
  projects: {
    data: [
      {
        vid: 'a3333333-b111-c111-d111-e00000000000',
        isFavorite: false,
        name: 'FEM Example Project',
        version: 1,
        description: null,
        status: ProjectStatusEnum.Unpublished,
        attendees: [
          {
            user: {
              name: 'Николай',
              role: 'main test user',
              __typename: 'User',
            },
            roles: [
              {
                name: 'Менеджер',
                __typename: 'ProjectRole',
              },
            ],
            __typename: 'Attendee',
          },
        ],
        region: null,
        editedAt: '2020-11-12T00:00:00',
        createdAt: '2020-11-12T00:00:00',
        createdBy: {
          name: 'Николай',
          vid: 'a1111123-b111-c111-d111-e00000000000',
          __typename: 'User',
        },
        __typename: 'Project',
      },
      {
        vid: 'a3333333-b111-c111-d111-e00000000011',
        isFavorite: false,
        name: 'Test project 11',
        version: 1,
        description: null,
        status: ProjectStatusEnum.Unpublished,
        attendees: [],
        region: null,
        editedAt: '2021-01-18T07:11:52.928000',
        createdAt: '2021-01-18T07:11:52.928000',
        createdBy: {
          name: 'Николай',
          vid: 'a1111123-b111-c111-d111-e00000000000',
          __typename: 'User',
        },
        __typename: 'Project',
      },
      {
        vid: 'a3333333-b111-c111-d111-e00000000022',
        isFavorite: false,
        name: 'Test project 22',
        version: 1,
        description: null,
        status: ProjectStatusEnum.Unpublished,
        attendees: [],
        region: null,
        editedAt: '2021-01-18T07:11:53.076000',
        createdAt: '2021-01-18T07:11:53.076000',
        createdBy: {
          name: 'Николай',
          vid: 'a1111123-b111-c111-d111-e00000000000',
          __typename: 'User',
        },
        __typename: 'Project',
      },
    ],
    __typename: 'ProjectList',
  },
  __typename: 'Query',
};

describe('projectsMapper', () => {
  test('возвращается массив с верным количеством элементов', () => {
    const mappedProjects = projectsMapper(mockedData);

    expect(mappedProjects.length).toBe(3);
  });

  test.skip('возвращается массив с ожидаемыми данными', () => {
    const mappedProjects = projectsMapper(mockedData);
    const expected = {
      id: 'a3333333-b111-c111-d111-e00000000000',
      name: 'FEM Example Project',
      version: 1,
      status: 'UNPUBLISHED',
      description: undefined,
      isFavorite: false,
      region: undefined,
      roles: 'Менеджер',
      createdBy: 'Николай',
      createdAt: '12 ноября 2020',
      editedAt: { date: '12 ноября 2020', time: ', 3:00' },
    };

    expect(mappedProjects[0]).toEqual(expected);
  });

  test('возвращается пустой массив при отсутствии проектов', () => {
    const list = {
      ...mockedData,
      ...{ projects: { __typename: 'ProjectList' } },
    } as ProjectsTableList;
    const mappedProjects = projectsMapper(list);

    expect(mappedProjects.length).toBe(0);
  });

  test('возвращается пустой массив при отсутствии проектов (data[null])', () => {
    const list = {
      ...mockedData,
      ...{ projects: { data: [null], __typename: 'ProjectList' } },
    } as ProjectsTableList;
    const mappedProjects = projectsMapper(list);

    expect(mappedProjects.length).toBe(0);
  });

  test('возвращается пустой массив при отсутствии проектов (нет __typename)', () => {
    const list = {
      ...mockedData,
      ...{ projects: { data: [{}] } },
    } as ProjectsTableList;
    const mappedProjects = projectsMapper(list);

    expect(mappedProjects.length).toBe(0);
  });

  test('возвращается массив c элементами по умолчанию', () => {
    const list = {
      ...mockedData,
      ...{
        projects: { data: [{ __typename: 'Project' }], __typename: 'ProjectList' },
      },
    } as ProjectsTableList;
    const mappedProjects = projectsMapper(list);

    expect(mappedProjects[0].id).toBe('wtf-id');
    expect(mappedProjects[0].name).toBe(undefined);
    expect(mappedProjects[0].version).toBe(undefined);
    expect(mappedProjects[0].status).toBe(undefined);
    expect(mappedProjects[0].description).toBe(undefined);
    expect(mappedProjects[0].createdBy).toBe(undefined);
    expect(mappedProjects[0].isFavorite).toBe(undefined);
    expect(mappedProjects[0].region).toBe(undefined);
    expect(mappedProjects[0].roles).toBe(undefined);
    expect(mappedProjects[0].createdAt).toBe(undefined);
    expect(mappedProjects[0].editedAt).toBe(undefined);
  });
});
