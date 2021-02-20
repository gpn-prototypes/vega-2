import React from 'react';
import { Router } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, fireEvent, render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { merge } from 'ramda';

import { ErrorCodesEnum, ProjectStatusEnum, ProjectTypeEnum } from '../../__generated__/types';
import { Bus } from '../../../types/bus';
import { Notifications } from '../../../types/notifications';
import { BusProvider, NotificationsProvider } from '../../providers';
import { DescriptionStep } from '../../ui/features/projects/ProjectForm/steps';

import {
  CreateBlankProjectDocument,
  DeleteBlankProjectDocument,
  ProjectFormFieldsDocument,
  ProjectFormRegionListDocument,
  UpdateProjectFormDocument,
} from './__generated__/project';
import { createCountry, createID, createProject, createRegion } from './__mocks__/schemas';
import { CreateProjectPage } from './CreateProjectPage';

type RenderComponentResult = {
  component: RenderResult;
  providers: {
    bus: Bus;
    history: MemoryHistory;
    notifications: Notifications;
  };
};

type Props = {
  mocks: MockedResponse[];
};

// https://trojanowski.dev/apollo-hooks-testing-without-act-warnings/
async function waitRequests(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const PROJECT_ID = createID();

const MockProjectFormFields: MockedResponse = {
  request: {
    query: ProjectFormFieldsDocument,
    variables: { vid: PROJECT_ID },
  },
  result: {
    data: {
      project: {
        ...createProject({ vid: PROJECT_ID, name: '' }),
        __typename: 'Project',
      },
    },
  },
};

const MockCreateBlankProject: MockedResponse = {
  request: {
    query: CreateBlankProjectDocument,
  },
  result: {
    data: {
      createProject: {
        result: {
          ...createProject({ vid: PROJECT_ID, status: ProjectStatusEnum.Blank, name: '' }),
          __typename: 'Project',
        },
        __typename: 'CreateProject',
      },
    },
  },
};

const MockProjectFormRegionList: MockedResponse = {
  request: {
    query: ProjectFormRegionListDocument,
  },
  result: {
    data: {
      regionList: [
        {
          __typename: 'Region',
          ...createRegion(),
          country: {
            ...createCountry(),
            __typename: 'Country',
          },
        },
      ],
    },
  },
};

const MockUpdateProjectForm: MockedResponse = {
  request: {
    query: UpdateProjectFormDocument,
    variables: {
      vid: PROJECT_ID,
      data: { name: 'something', version: 1 },
    },
  },
  result: {
    data: {
      updateProject: {
        result: {
          ...createProject({
            vid: PROJECT_ID,
            name: 'something',
            type: ProjectTypeEnum.Geo,
            region: null,
            coordinates: null,
            description: null,
            yearStart: 2022,
            version: 1,
            status: ProjectStatusEnum.Unpublished,
          }),
          __typename: 'Project',
        },
        __typename: 'UpdateProject',
      },
    },
  },
};

const defaultProps = {
  mocks: [MockCreateBlankProject, MockProjectFormRegionList, MockProjectFormFields],
};

const getInput = async (testid: string): Promise<HTMLInputElement> => {
  const field = await screen.findByTestId(testid);
  const input = field.querySelector('input');

  if (input === null) {
    throw new Error('input not found');
  }

  return input;
};

const renderComponent = (props?: Partial<Props>): RenderComponentResult => {
  const withDefaults = merge(defaultProps);
  const { mocks } = props ? withDefaults(props) : defaultProps;

  const history = createMemoryHistory();
  const unsub = jest.fn();

  const bus = {
    send: jest.fn(),
    subscribe: jest.fn().mockImplementation(() => {
      return unsub;
    }),
  } as Bus;

  const notifications = {
    add: jest.fn(),
    remove: jest.fn(),
    subscribe: jest.fn(),
    getAll: jest.fn(),
  } as Notifications;

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['vid'],
      },
    },
  });

  const component = render(
    <Router history={history}>
      <MockedProvider mocks={mocks} cache={cache}>
        <BusProvider bus={bus}>
          <NotificationsProvider notifications={notifications}>
            <CreateProjectPage />
          </NotificationsProvider>
        </BusProvider>
      </MockedProvider>
    </Router>,
  );

  return {
    component,
    providers: {
      bus,
      history,
      notifications,
    },
  };
};

describe('CreateProjectPage', () => {
  it('показывает loader при запросах', async () => {
    renderComponent();

    const loader = await screen.findByLabelText('Загрузка');

    expect(loader).toBeInTheDocument();
    await waitRequests();
  });

  describe('успешное создание проекта', () => {
    let providers: RenderComponentResult['providers'];

    beforeEach(async () => {
      const MockUpdateProject = {
        request: {
          query: UpdateProjectFormDocument,
          variables: {
            vid: PROJECT_ID,
            data: { status: ProjectStatusEnum.Unpublished, version: 1 },
          },
        },
        result: {
          data: {
            updateProject: {
              result: {
                ...createProject({
                  vid: PROJECT_ID,
                  name: 'something',
                  type: ProjectTypeEnum.Geo,
                  region: null,
                  coordinates: null,
                  description: null,
                  yearStart: 2022,
                  version: 1,
                  status: ProjectStatusEnum.Unpublished,
                }),
                __typename: 'Project',
              },
              __typename: 'UpdateProject',
            },
          },
        },
      };

      const result = renderComponent({
        mocks: [
          MockCreateBlankProject,
          MockProjectFormRegionList,
          MockProjectFormFields,
          MockUpdateProjectForm,
          MockUpdateProject,
        ],
      });

      providers = result.providers;

      await waitRequests();

      const name = await getInput(DescriptionStep.testId.name);

      userEvent.type(name, 'something');
      fireEvent.blur(name);

      const submit = await screen.findByText('Создать проект');

      userEvent.click(submit);

      await waitRequests();
    });

    it('вызывает нотификацию', async () => {
      await waitRequests();

      expect(providers.notifications.add).toBeCalledWith(
        expect.objectContaining({ message: 'Проект успешно создан' }),
      );

      await waitRequests();
    });

    it('редиректит на страницу проекта', async () => {
      await waitRequests();

      expect(providers.history.location.pathname).toEqual(`/projects/show/${PROJECT_ID}`);

      await waitRequests();
    });
  });

  describe('создание бланка проекта с ошибкой', () => {
    it('вызывает нотификацию', async () => {
      const errorMessage = 'Такой проект уже существует';

      const MockWithError = {
        request: {
          query: CreateBlankProjectDocument,
        },
        result: {
          data: {
            createProject: {
              result: {
                code: ErrorCodesEnum.ProjectNameAlreadyExists,
                message: errorMessage,
                __typename: 'Error',
              },
              __typename: 'CreateProject',
            },
          },
        },
      };

      const { providers } = renderComponent({
        mocks: [MockWithError, MockProjectFormRegionList, MockProjectFormFields],
      });

      await waitRequests();

      expect(providers.notifications.add).toBeCalledWith(
        expect.objectContaining({ message: errorMessage }),
      );
      await waitRequests();
    });
  });

  it('показывает ошибку валидации с сервера при обновлении проекта', async () => {
    const errorMessage = 'Такой проект уже существует';
    const MockWithError = {
      request: {
        query: UpdateProjectFormDocument,
        variables: {
          vid: PROJECT_ID,
          data: { status: ProjectStatusEnum.Unpublished, version: 1 },
        },
      },
      result: {
        data: {
          updateProject: {
            __typename: 'UpdateProject',
            result: {
              __typename: 'ValidationError',
              items: [
                {
                  __typename: 'ValidationErrorItemType',
                  code: 'NOT_UNIQUE',
                  message: errorMessage,
                  path: ['data', 'name'],
                },
              ],
            },
          },
        },
      },
    };

    renderComponent({
      mocks: [
        MockCreateBlankProject,
        MockProjectFormRegionList,
        MockProjectFormFields,
        MockUpdateProjectForm,
        MockWithError,
      ],
    });

    await waitRequests();

    const name = await getInput(DescriptionStep.testId.name);

    userEvent.type(name, 'something');
    fireEvent.blur(name);

    await waitRequests();

    const submit = await screen.findByText('Создать проект');

    userEvent.click(submit);

    await waitRequests();

    const error = await screen.findByText(errorMessage);

    expect(error).toBeInTheDocument();
  });

  describe('отмена проекта', () => {
    let providers: RenderComponentResult['providers'];

    beforeEach(async () => {
      const MockDeleteProjectBlank = {
        request: {
          query: DeleteBlankProjectDocument,
          variables: { vid: PROJECT_ID },
        },
        result: {
          data: {
            deleteProject: {
              result: {
                vid: PROJECT_ID,
                __typename: 'Result',
              },
              __typename: 'DeleteProject',
            },
          },
        },
      };

      const result = renderComponent({
        mocks: [
          MockCreateBlankProject,
          MockProjectFormRegionList,
          MockProjectFormFields,
          MockDeleteProjectBlank,
        ],
      });

      providers = result.providers;

      await waitRequests();

      const cancel = await screen.findByText('Отмена');

      userEvent.click(cancel);

      await waitRequests();
    });

    it('показывает модалку при отмене проекта', async () => {
      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();
      await waitRequests();
    });

    it('редиректит при подтверждении', async () => {
      const accept = await screen.findByText('Да, прервать');

      userEvent.click(accept);

      await waitRequests();

      expect(providers.history.location.pathname).toEqual('/projects');
      await waitRequests();
    });

    it('вызывает событие удаление проекта по шине', async () => {
      const accept = await screen.findByText('Да, прервать');

      userEvent.click(accept);

      await waitRequests();

      expect(providers.bus.send).toBeCalled();
      await waitRequests();
    });
  });

  it.todo('принимает событие удаления проекта по шине');
  it.todo('показывает уведомление об ошибки в apollo');

  it.skip('происходит пуллинг новых данные каждые 30 сек', async () => {
    let counter = 0;
    renderComponent({
      mocks: [
        MockCreateBlankProject,
        MockProjectFormRegionList,
        {
          request: {
            query: ProjectFormFieldsDocument,
            variables: { vid: PROJECT_ID },
          },
          newData: () => {
            counter += 1;

            if (counter === 2) {
              return {
                data: {
                  project: {
                    ...createProject({ vid: PROJECT_ID, name: 'Обновленный проект' }),
                    __typename: 'Project',
                  },
                },
              };
            }

            return {
              data: {
                project: {
                  ...createProject({ vid: PROJECT_ID, name: 'Начальный проект' }),
                  __typename: 'Project',
                },
              },
            };
          },
        },
      ],
    });

    await waitRequests();

    let name = await getInput(DescriptionStep.testId.name);

    expect(name.value).toEqual('Начальный проект');

    await waitRequests();

    name = await getInput(DescriptionStep.testId.name);

    await waitRequests();

    expect(name.value).toEqual('Обновленный проект');

    await waitRequests();
  });
});
