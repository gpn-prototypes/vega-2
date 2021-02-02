import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../__generated__/types';
import { mountApp } from '../../../test-utils';
import { createProject } from '../../../test-utils/data-generators';
import { MockNotifications } from '../../../test-utils/notificationsMock';

import { ProjectsTableListDocument } from './__generated__/projects';
import { mocks } from './__mocks__/mocks';
import { EditedAt } from './ProjectsTable/EditedAt';
import { ModalDeleteProject } from './ModalDeleteProject';
import { ProjectsPage } from './ProjectsPage';
import { ProjectsPageView } from './ProjectsPageView';
import { ProjectsTable } from './ProjectsTable';

function openMenuProject() {
  userEvent.click(screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]);
}

function openModalRemoveProject() {
  userEvent.click(screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]);
  userEvent.click(screen.getByTestId(ProjectsPage.testId.projectRemove));
}

const generateProjects = (number: number) => {
  const projects = [];

  for (let i = 1; i <= number; i += 1) {
    projects.push(createProject({ status: ProjectStatusEnum.Unpublished }));
  }

  return projects;
};

describe('ProjectsPage', () => {
  const addMock = jest.fn();
  const removeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('отрисовывается индикатор загрузки', async () => {
    const defaultMock = mocks.default;
    await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    expect(screen.getByTestId(ProjectsPageView.testId.loader)).toBeVisible();
  });

  test('отрисовывается страница c данными', async () => {
    const defaultMock = mocks.default;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequest();

    expect(screen.getByTestId(ProjectsPageView.testId.rootTitle)).toBeVisible();
    expect(screen.getByTestId(ProjectsPageView.testId.table)).toBeVisible();
    expect(screen.getByText(defaultMock[0].result.data.projects.data[2].name)).toBeVisible();
  });

  test('проект помечается избранным', async () => {
    const favoriteProjectMock = mocks.favoriteProject;
    const notifications = new MockNotifications({ addMock, removeMock });

    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: favoriteProjectMock,
      notifications,
    });

    await waitRequest();

    const nameProject = favoriteProjectMock[0].result.data.projects?.data[0].name as string;

    userEvent.hover(screen.getByText(nameProject));

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    await waitRequest();

    expect(screen.getByTestId(ProjectsTable.testId.favoriteSelectedButton)).toBeVisible();
  });

  test('обрабатывается ошибка при добавление в избранное', async () => {
    const favoriteErrorProjectMock = mocks.favoriteErrorProject;
    const notifications = new MockNotifications({ addMock, removeMock });

    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: favoriteErrorProjectMock,
      notifications,
    });

    await waitRequest();

    const nameProject = favoriteErrorProjectMock[0].result.data.projects?.data[0].name as string;
    userEvent.hover(screen.getByText(nameProject));

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    await waitRequest();

    const call = addMock.mock.calls[0][0];

    call.onClose(call);

    expect(notifications.getAll().length).toBe(0);
    expect(removeMock).toBeCalled();

    expect(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]).toBeVisible();
  });

  test('проект удаляется', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const notifications = new MockNotifications({ addMock, removeMock });
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
      notifications,
    });

    await waitRequest();

    const projectName = deleteProjectMock[0].result.data.projects?.data[0].name as string;
    const nameCells = await waitFor(() => screen.getAllByTestId(ProjectsTable.testId.projectName));

    expect(screen.getByText(projectName)).toBeVisible();

    openModalRemoveProject();

    expect(nameCells.length).toBe(3);
    expect(screen.getByTestId(ModalDeleteProject.testId.modal)).toBeVisible();

    userEvent.click(screen.getByTestId(ModalDeleteProject.testId.modalConfirm));

    await waitRequest();

    const newNameCells = await waitFor(() =>
      screen.getAllByTestId(ProjectsTable.testId.projectName),
    );

    const firstProjectName = newNameCells[0].textContent;

    const nextProjectName = deleteProjectMock[2].result.data.projects?.data[0].name;

    expect(firstProjectName).toBe(nextProjectName);
    expect(newNameCells.length).toBe(2);

    expect(addMock).toBeCalled();
    expect(notifications.getAll().length).toBe(1);

    const call = addMock.mock.calls[0][0];

    call.onClose(call);

    expect(notifications.getAll().length).toBe(0);
    expect(removeMock).toBeCalled();
  });

  test('модальное окно закрывается при отмене удаления', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = screen.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeVisible();

    userEvent.click(screen.getByTestId(ModalDeleteProject.testId.modalCancel));

    expect(modal).not.toBeInTheDocument();
  });

  test('модальное окно закрывается', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = screen.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeVisible();

    userEvent.click(screen.getByLabelText('Кнопка закрытия модального окна'));

    expect(modal).not.toBeInTheDocument();
  });

  test('происходит переход после клика на строку', async () => {
    const defaultMock = mocks.default;
    const { waitRequest, history } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
      url: '/projects',
    });

    await waitRequest();

    expect(history.location.pathname).toBe('/projects');

    userEvent.click(screen.getByText(defaultMock[0].result.data.projects.data[2].name));

    const newUrl = `/projects/show/${defaultMock[0].result.data.projects.data[2].vid}`;

    expect(history.location.pathname).toBe(newUrl);
  });

  test('происходит переход на страницу редактирования', async () => {
    const defaultMock = mocks.default;
    const { waitRequest, history } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
      url: '/projects',
    });

    await waitRequest();

    expect(history.location.pathname).toBe('/projects');

    const urlProjectForEdit = `/projects/show/${defaultMock[0].result.data.projects.data[0].vid}`;

    openMenuProject();

    userEvent.click(screen.getByTestId(ProjectsPage.testId.projectEdit));

    expect(history.location.pathname).toBe(urlProjectForEdit);
  });

  test('происходит перезапрос данных при активации таба', async () => {
    const defaultMock = mocks.refetch;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequest();

    expect(screen.getByText(defaultMock[0].result.data.projects.data[0].name)).toBeVisible();

    await waitRequest();

    waitFor(() => {
      expect(screen.getByText(defaultMock[1].result.data.projects.data[0].name)).toBeVisible();
    });

    jest.useFakeTimers();
    jest.runTimersToTime(3005);
    jest.useRealTimers();

    await waitRequest();
    waitFor(() => {
      expect(screen.getByText(defaultMock[2].result.data.projects.data[0].name)).toBeVisible();
    });

    jest.clearAllTimers();
  });

  describe('пагинация', () => {
    const [firstPart, secondPart] = [generateProjects(20), generateProjects(20)];

    const paginationMocks = [
      {
        request: {
          query: ProjectsTableListDocument,
          variables: {
            pageNumber: 1,
            pageSize: 20,
            includeBlank: false,
          },
        },
        result: {
          data: {
            projects: {
              data: firstPart,
              itemsTotal: 40,
              __typename: 'ProjectList',
            },
            __typename: 'Query',
          },
        },
      },
      {
        request: {
          query: ProjectsTableListDocument,
          variables: {
            pageNumber: 2,
            pageSize: 20,
            includeBlank: false,
          },
        },
        result: {
          data: {
            projects: {
              data: secondPart,
              itemsTotal: 40,
              __typename: 'ProjectList',
            },
            __typename: 'Query',
          },
        },
      },
    ];

    it('загружает проекты', async () => {
      const { waitRequest } = await mountApp(<ProjectsPage />, {
        mocks: paginationMocks,
      });

      await waitRequest();

      const loadMoreButton = screen.getByText('Загрузить ещё');
      const lastProjectName = secondPart[secondPart.length - 1].name as string;

      expect(screen.getByText('20 из 40')).toBeInTheDocument();
      expect(screen.queryByText(secondPart[0].name as string)).not.toBeInTheDocument();

      userEvent.click(loadMoreButton);

      await waitRequest();

      expect(screen.getByText('40 из 40')).toBeInTheDocument();
      expect(screen.queryByText(lastProjectName)).toBeInTheDocument();
      expect(loadMoreButton).not.toBeInTheDocument();
    });
  });
});
