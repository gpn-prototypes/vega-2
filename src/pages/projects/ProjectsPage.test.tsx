import React from 'react';
import * as tl from '@testing-library/react';
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

function openMenuProject(projectName: string) {
  tl.fireEvent.mouseOver(tl.screen.getByText(projectName));
  tl.fireEvent.click(tl.screen.getByTestId(EditedAt.testId.buttonMenu));
}

function openModalRemoveProject() {
  userEvent.click(tl.screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]);
  userEvent.click(tl.screen.getByTestId(ProjectsPage.testId.projectRemove));
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

  test('Отрисовывается индикатор загрузки', async () => {
    const defaultMock = mocks.default;
    await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    expect(tl.screen.getByTestId(ProjectsPageView.testId.loader)).toBeInTheDocument();
  });

  test('отрисовывается страница c данными', async () => {
    const defaultMock = mocks.default;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequest();

    expect(tl.screen.getByTestId(ProjectsPageView.testId.rootTitle)).toBeInTheDocument();
    expect(tl.screen.getByTestId(ProjectsPageView.testId.table)).toBeInTheDocument();
    expect(
      tl.screen.getByText(defaultMock[0].result.data.projects.data[2].name),
    ).toBeInTheDocument();
  });

  test.skip('Проект помечается избранным', async () => {
    const favoriteProjectMock = mocks.favoriteProject;
    const notifications = new MockNotifications({ addMock, removeMock });

    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: favoriteProjectMock,
      notifications,
    });

    await waitRequest();

    const nameProject = favoriteProjectMock[0].result.data.projects?.data[0].name ?? '';
    tl.fireEvent.mouseOver(tl.screen.getByText(nameProject));

    tl.act(() => {
      tl.fireEvent.click(tl.screen.getByTestId(ProjectsTable.testId.favoriteNotSelectedButton));
    });

    await waitRequest();

    expect(tl.screen.getByTestId(ProjectsTable.testId.favoriteSelectedButton)).toBeInTheDocument();
  });

  test('Обрабатывается ошибка при добавление в избранное', async () => {
    const favoriteErrorProjectMock = mocks.favoriteErrorProject;
    const notifications = new MockNotifications({ addMock, removeMock });

    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: favoriteErrorProjectMock,
      notifications,
    });

    await waitRequest();

    const nameProject = favoriteErrorProjectMock[0].result.data.projects?.data[0].name ?? '';
    tl.fireEvent.mouseOver(tl.screen.getByText(nameProject));

    tl.act(() => {
      tl.fireEvent.click(tl.screen.getByTestId(ProjectsTable.testId.favoriteNotSelectedButton));
    });

    await waitRequest();

    const call = addMock.mock.calls[0][0];

    call.onClose(call);

    expect(notifications.getAll().length).toBe(0);
    expect(removeMock).toBeCalled();

    expect(
      tl.screen.getByTestId(ProjectsTable.testId.favoriteNotSelectedButton),
    ).toBeInTheDocument();
  });

  test.skip('проект удаляется', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const notifications = new MockNotifications({ addMock, removeMock });
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
      notifications,
    });

    await waitRequest();

    const projectName = deleteProjectMock[0].result.data.projects?.data[0].name as string;
    const nameCells = await tl.waitFor(() => $.getAllByTestId(ProjectsTable.testId.projectName));

    expect(tl.screen.getByText(projectName)).toBeVisible();

    openModalRemoveProject();

    expect(nameCells.length).toBe(3);
    expect(tl.screen.getByTestId(ModalDeleteProject.testId.modal)).toBeInTheDocument();

    tl.act(() => {
      tl.fireEvent.click(tl.screen.getByTestId(ModalDeleteProject.testId.modalConfirm));
    });

    await waitRequest();

    const newNameCells = await tl.waitFor(() =>
      tl.screen.getAllByTestId(ProjectsTable.testId.projectName),
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
<<<<<<< HEAD

    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
=======
    const { waitRequest } = await mountApp(<ProjectsPage />, {
>>>>>>> test(mount-app): добавить обработку url, уведомления
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = tl.screen.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    tl.fireEvent.click(tl.screen.getByTestId(ModalDeleteProject.testId.modalCancel));

    expect(modal).not.toBeInTheDocument();
  });

  test('модальное окно закрывается', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = tl.screen.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    tl.fireEvent.click(tl.screen.getByLabelText('Кнопка закрытия модального окна'));

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

    tl.act(() => {
      tl.fireEvent.click(tl.screen.getByText(defaultMock[0].result.data.projects.data[2].name));
    });

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

    const nameProject = defaultMock[0].result.data.projects?.data[0].name ?? '';
    const urlProjectForEdit = `/projects/show/${defaultMock[0].result.data.projects.data[0].vid}`;

    openMenuProject(nameProject);

    tl.act(() => {
      tl.fireEvent.click(tl.screen.getByTestId(ProjectsPage.testId.projectEdit));
    });

    expect(history.location.pathname).toBe(urlProjectForEdit);
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

      const loadMoreButton = tl.screen.getByText('Загрузить ещё');
      const lastProjectName = secondPart[secondPart.length - 1].name as string;

      expect(tl.screen.getByText('20 из 40')).toBeInTheDocument();
      expect(tl.screen.queryByText(secondPart[0].name as string)).not.toBeInTheDocument();

      userEvent.click(loadMoreButton);

      await waitRequest();

      expect(tl.screen.getByText('40 из 40')).toBeInTheDocument();
      expect(tl.screen.queryByText(lastProjectName)).toBeInTheDocument();
      expect(loadMoreButton).not.toBeInTheDocument();
    });
  })
});
