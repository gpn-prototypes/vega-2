import React from 'react';
import { Route } from 'react-router-dom';
import { MockedResponse } from '@apollo/client/testing';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Notifications } from '../../../types/notifications';
import { render as utilsRender, RenderResult, waitRequests } from '../../testing';
import * as dataGenerators from '../../testing/data-generators';

import {
  ProjectFormFieldsDocument,
  ProjectFormRegionListDocument,
  UpdateProjectFormDocument,
} from './__generated__/project';
import { EditProjectPage } from './EditProjectPage';

const PROJECT_ID = dataGenerators.createID();
const PROJECT = dataGenerators.createProject({ vid: PROJECT_ID });

const MockProjectFormFields = (project = PROJECT): MockedResponse => ({
  request: {
    query: ProjectFormFieldsDocument,
    variables: { vid: PROJECT_ID },
  },
  result: {
    data: {
      project: {
        ...project,
        __typename: 'Project',
      },
    },
  },
});

const MockProjectFormRegionList = (): MockedResponse => ({
  request: {
    query: ProjectFormRegionListDocument,
  },
  result: {
    data: {
      regionList: [
        {
          __typename: 'Region',
          ...dataGenerators.createRegion(),
          country: {
            ...dataGenerators.createCountry(),
            __typename: 'Country',
          },
        },
      ],
    },
  },
});

const MockUpdateProjectForm = (
  project = PROJECT,
  data = { name: 'something', version: 1 },
): MockedResponse => ({
  request: {
    query: UpdateProjectFormDocument,
    variables: {
      vid: PROJECT_ID,
      data,
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
});

const URL = `/projects/show/${PROJECT_ID}`;

const currentProject = {
  get: () => ({
    vid: PROJECT_ID,
    version: 1,
  }),
};

const render = ({
  mocks = [],
}: {
  mocks?: MockedResponse[];
  notifications?: Notifications;
}): RenderResult => {
  const component = (
    <Route path="/projects/show/:projectId">
      <EditProjectPage />
    </Route>
  );

  return utilsRender(component, {
    mocks,
    currentProject,
    route: URL,
  });
};

const TEXT_BUTTON_RESET = 'Отменить';
const TEXT_BUTTON_SUBMIT = 'Сохранить изменения';
const TEXT_LABEL_NAME = 'Название проекта';

const findNameInput = async () =>
  (await screen.findByLabelText(TEXT_LABEL_NAME)) as HTMLInputElement;

const findButtonReset = async () => screen.findByText(TEXT_BUTTON_RESET);
const findButtonSubmit = async () => screen.findByText(TEXT_BUTTON_SUBMIT);

describe('EditProjectPage', () => {
  it('рендерит без ошибок', async () => {
    const r = () => {
      render({
        mocks: [MockProjectFormFields(), MockProjectFormRegionList()],
      });
    };

    expect(r).not.toThrow();
  });

  it('инициализирует значения в форме на начальные после сброса', async () => {
    render({
      mocks: [MockProjectFormFields(), MockProjectFormRegionList(), MockProjectFormFields()],
    });

    await waitRequests();

    const inputName = await findNameInput();

    userEvent.clear(inputName);
    userEvent.type(inputName, 'random');

    const buttonReset = await findButtonReset();

    userEvent.click(buttonReset);

    await waitRequests();

    expect(inputName.value).toEqual(PROJECT.name);
  });

  it('выводит сообщение об успешном обновлении', async () => {
    const valueName = 'Пышки плюшки';

    const { app } = render({
      mocks: [
        MockProjectFormFields(),
        MockProjectFormRegionList(),
        MockUpdateProjectForm({ ...PROJECT, name: valueName }, { name: valueName, version: 1 }),
      ],
    });

    const spy = jest.spyOn(app.notifications, 'add');

    await waitRequests();

    const inputName = await findNameInput();

    userEvent.clear(inputName);
    userEvent.type(inputName, valueName);

    const buttonSubmit = await findButtonSubmit();

    userEvent.click(buttonSubmit);

    await waitRequests();

    expect(spy).toBeCalledWith(expect.objectContaining({ body: 'Изменения успешно сохранены' }));
  });

  it('показывает ошибки валидации с сервера', async () => {
    const errorMessage = 'Такой проект уже существует';
    const valueName = 'Пышки плюшки';

    const MockUpdateProjectFormWithValidationError = () => {
      return {
        request: {
          query: UpdateProjectFormDocument,
          variables: {
            vid: PROJECT_ID,
            data: { version: 1, name: valueName },
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
    };

    render({
      mocks: [
        MockProjectFormFields(),
        MockProjectFormRegionList(),
        MockUpdateProjectFormWithValidationError(),
        MockProjectFormFields(),
      ],
    });

    await waitRequests();

    const inputName = await findNameInput();

    userEvent.clear(inputName);
    userEvent.type(inputName, valueName);

    const buttonSubmit = await findButtonSubmit();

    userEvent.click(buttonSubmit);

    await waitRequests();

    const error = await screen.findByText(errorMessage);

    expect(error).toBeInTheDocument();
  });

  describe('Footer', () => {
    it('переключает состояние при изменениях в форме', async () => {
      render({
        mocks: [MockProjectFormFields(), MockProjectFormRegionList()],
      });

      await waitRequests();

      const inputName = await findNameInput();

      expect(screen.queryByText(TEXT_BUTTON_SUBMIT)).not.toBeInTheDocument();

      userEvent.clear(inputName);
      userEvent.type(inputName, 'Покажи футер');

      expect(screen.queryByText(TEXT_BUTTON_SUBMIT)).toBeInTheDocument();

      userEvent.clear(inputName);
      userEvent.type(inputName, PROJECT.name!);

      expect(screen.queryByText(TEXT_BUTTON_SUBMIT)).not.toBeInTheDocument();
    });
    // TODO: Проблема с фейковыми таймерами и моком аполло.
    it.todo('скрывается, если в год указать кастомное значение');
  });
});
