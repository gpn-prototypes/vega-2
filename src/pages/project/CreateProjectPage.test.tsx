import React from 'react';
import { MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { merge } from 'ramda';

import { ErrorCodesEnum, ProjectStatusEnum, ProjectTypeEnum } from '../../__generated__/types';
import { act, fireEvent, render, RenderResult, screen, waitFor, waitRequests } from '../../testing';
import { DescriptionStep } from '../../ui/features/projects/ProjectForm/steps';

import {
  CreateBlankProjectDocument,
  DeleteBlankProjectDocument,
  ProjectFormFieldsDocument,
  ProjectFormRegionListDocument,
  UpdateProjectFormDocument,
  UpdateProjectStatusDocument,
} from './__generated__/project';
import { createCountry, createID, createProject, createRegion } from './__mocks__/schemas';
import { CreateProjectPage } from './CreateProjectPage';

type Props = {
  mocks: MockedResponse[];
};

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

const MockUpdateProjectStatus = {
  request: {
    query: UpdateProjectStatusDocument,
    variables: {
      vid: PROJECT_ID,
      data: {
        status: ProjectStatusEnum.Unpublished,
        version: 1,
      },
    },
  },
  result: {
    data: {
      updateProjectStatus: {
        result: {
          ...createProject({
            vid: PROJECT_ID,
            name: '',
            version: 1,
            status: ProjectStatusEnum.Unpublished,
          }),
          __typename: 'Project',
        },
        __typename: 'UpdateProjectStatus',
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

const renderComponent = (props?: Partial<Props>): RenderResult => {
  const withDefaults = merge(defaultProps);
  const { mocks } = props ? withDefaults(props) : defaultProps;

  return render(<CreateProjectPage />, { mocks });
};

describe('CreateProjectPage', () => {
  it('показывает loader при запросах', async () => {
    renderComponent();

    await act(async () => {
      const loader = await screen.findByLabelText('Загрузка');

      expect(loader).toBeInTheDocument();
    });

    await waitRequests();
  });

  describe('успешное создание проекта', () => {
    let providers: RenderResult;

    beforeEach(async () => {
      const project = createProject({
        vid: PROJECT_ID,
        name: 'something',
        type: ProjectTypeEnum.Geo,
        region: null,
        coordinates: null,
        description: null,
        version: 1,
        status: ProjectStatusEnum.Unpublished,
      });

      const MockUpdateProject = {
        request: {
          query: UpdateProjectFormDocument,
          variables: {
            vid: PROJECT_ID,
            data: { version: 1 },
          },
        },
        result: {
          data: {
            updateProject: {
              result: {
                ...project,
                __typename: 'Project',
              },
              __typename: 'UpdateProject',
            },
          },
        },
      };

      providers = renderComponent({
        mocks: [
          MockCreateBlankProject,
          MockProjectFormRegionList,
          MockProjectFormFields,
          MockUpdateProjectForm,
          MockUpdateProjectStatus,
          MockUpdateProject,
        ],
      });

      await waitRequests();

      const name = await getInput(DescriptionStep.testId.name);

      userEvent.type(name, 'something');
      fireEvent.blur(name);

      const submit = await screen.findByText('Создать проект');

      userEvent.click(submit);

      await waitRequests();
    });

    it('вызывает нотификацию', async () => {
      const spy = jest.spyOn(providers.app.notifications, 'add');
      await waitRequests();

      await waitFor(() =>
        expect(spy).toBeCalledWith(expect.objectContaining({ body: 'Проект успешно создан' })),
      );

      await waitRequests();
    });

    it('редиректит на страницу проекта', async () => {
      await waitRequests();

      expect(providers.app.history.location.pathname).toEqual(`/projects/show/${PROJECT_ID}`);

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

      const { app } = renderComponent({
        mocks: [MockWithError, MockProjectFormRegionList, MockProjectFormFields],
      });

      const spy = jest.spyOn(app.notifications, 'add');

      await waitRequests();

      expect(spy).toBeCalledWith(expect.objectContaining({ body: errorMessage }));
      await waitRequests();
    });
  });

  it('показывает ошибку валидации с сервера при обновлении проекта', async () => {
    const errorMessage = 'Такой проект уже существует';
    // Заменил  здесь мок, так как только так тесты проходили и не ругались на отсутствие моков. Надо завести MockedProvider сюда
    const MockWithError = {
      request: {
        query: UpdateProjectStatusDocument,
        variables: {
          vid: PROJECT_ID,
          data: { version: 1, status: ProjectStatusEnum.Unpublished },
        },
      },
      result: {
        data: {
          updateProjectStatus: {
            __typename: 'UpdateProjectStatus',
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
    let providers: RenderResult;

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

      providers = renderComponent({
        mocks: [
          MockCreateBlankProject,
          MockProjectFormRegionList,
          MockProjectFormFields,
          MockDeleteProjectBlank,
        ],
      });

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

      expect(providers.app.history.location.pathname).toEqual('/projects');
      await waitRequests();
    });

    it('вызывает событие удаление проекта по шине', async () => {
      const spy = jest.spyOn(providers.app.bus, 'send');
      const accept = await screen.findByText('Да, прервать');

      userEvent.click(accept);

      await waitRequests();

      expect(spy).toBeCalled();
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
