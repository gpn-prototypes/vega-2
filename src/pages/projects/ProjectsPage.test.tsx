import React from 'react';
import userEvent from '@testing-library/user-event';

import { fireEvent, render, screen, waitFor, waitRequests } from '../../testing';

import { secondPart } from './__mocks__/mock-paginations';
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

describe('ProjectsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('отрисовывается индикатор загрузки', async () => {
    const defaultMock = mocks.default;
    await render(<ProjectsPage />, {
      mocks: defaultMock,
    });

    expect(screen.getByTestId(ProjectsPageView.testId.loader)).toBeVisible();
  });

  test('отрисовывается страница c данными', async () => {
    const defaultMock = mocks.default;
    await render(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequests();

    await waitFor(() =>
      expect(screen.getByTestId(ProjectsPageView.testId.rootTitle)).toBeVisible(),
    );
    await waitFor(() => expect(screen.getByTestId(ProjectsPageView.testId.table)).toBeVisible());
    await waitFor(() =>
      expect(
        screen.getByText(defaultMock[1].result.data.projects?.data[2].name as string),
      ).toBeVisible(),
    );
  });

  test('проект помечается избранным', async () => {
    const favoriteProjectMock = mocks.favoriteProject;

    await render(<ProjectsPage />, {
      mocks: favoriteProjectMock,
    });

    await waitRequests();

    const nameProject = favoriteProjectMock[1].result.data.projects?.data[0].name as string;

    userEvent.hover(screen.getByText(nameProject));

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    await waitRequests();

    expect(screen.getByTestId(ProjectsTable.testId.favoriteSelectedButton)).toBeVisible();
  });

  test('обрабатывается ошибка при добавление в избранное', async () => {
    const favoriteErrorProjectMock = mocks.favoriteErrorProject;

    const { app } = await render(<ProjectsPage />, {
      mocks: favoriteErrorProjectMock,
    });

    const spy = jest.spyOn(app.notifications, 'add');

    await waitRequests();

    const nameProject = favoriteErrorProjectMock[1].result.data.projects?.data[0].name as string;
    userEvent.hover(screen.getByText(nameProject));

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    await waitRequests();

    expect(spy).toBeCalledWith(expect.objectContaining({ body: 'Ошибка в избранном' }));
    expect(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]).toBeVisible();
  });

  test('проект удаляется', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { app } = await render(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    const spy = jest.spyOn(app.notifications, 'add');

    await waitRequests();

    const projectName = deleteProjectMock[1].result.data.projects?.data[0].name as string;
    const nameCells = await waitFor(() => screen.getAllByTestId(ProjectsTable.testId.projectName));

    expect(screen.getByText(projectName)).toBeVisible();

    openModalRemoveProject();

    expect(nameCells.length).toBe(3);
    expect(screen.getByTestId(`${ModalDeleteProject.testId.modal}:root`)).toBeVisible();

    userEvent.click(screen.getByTestId(ModalDeleteProject.testId.modalConfirm));

    await waitRequests();

    const newNameCells = await screen.findAllByTestId(ProjectsTable.testId.projectName);

    const firstProjectName = newNameCells[0].textContent;

    const nextProjectName = deleteProjectMock[4].result.data.projects?.data[0].name;

    expect(firstProjectName).toBe(nextProjectName);
    expect(newNameCells.length).toBe(2);

    expect(spy).toBeCalledWith(
      expect.objectContaining({ body: `Проект «${projectName}» успешно удален.` }),
    );
  });

  test('модальное окно закрывается при отмене удаления', async () => {
    const deleteProjectMock = mocks.deleteProject;
    await render(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequests();

    openModalRemoveProject();

    const modal = screen.getByTestId(`${ModalDeleteProject.testId.modal}:root`);

    expect(modal).toBeVisible();

    userEvent.click(screen.getByTestId(ModalDeleteProject.testId.modalCancel));

    expect(modal).not.toBeInTheDocument();
  });

  test('модальное окно закрывается', async () => {
    const deleteProjectMock = mocks.deleteProject;
    await render(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequests();

    openModalRemoveProject();

    const modal = screen.getByTestId(`${ModalDeleteProject.testId.modal}:root`);

    expect(modal).toBeVisible();

    userEvent.click(screen.getByLabelText('Кнопка закрытия модального окна'));

    expect(modal).not.toBeInTheDocument();
  });

  test('происходит переход после клика на строку', async () => {
    const defaultMock = mocks.default;
    const { app } = await render(<ProjectsPage />, {
      mocks: defaultMock,
      route: '/projects',
    });

    await waitRequests();

    expect(app.history.location.pathname).toBe('/projects');

    userEvent.click(screen.getByText(defaultMock[1].result.data.projects?.data[2].name as string));

    const newUrl = `/projects/show/${defaultMock[1].result.data.projects?.data[2].vid}`;

    expect(app.history.location.pathname).toBe(newUrl);
  });

  test('происходит переход на страницу редактирования', async () => {
    const defaultMock = mocks.default;
    const { app } = await render(<ProjectsPage />, {
      mocks: defaultMock,
      route: '/projects',
    });

    await waitRequests();

    expect(app.history.location.pathname).toBe('/projects');

    const urlProjectForEdit = `/projects/show/${defaultMock[1]?.result?.data?.projects?.data[0].vid}`;

    openMenuProject();

    userEvent.click(screen.getByTestId(ProjectsPage.testId.projectEdit));

    expect(app.history.location.pathname).toBe(urlProjectForEdit);
  });

  test.skip('происходит перезапрос данных при активации таба', async () => {
    const refetchMock = mocks.refetch;
    await render(<ProjectsPage />, {
      mocks: refetchMock,
    });

    await waitRequests();

    expect(
      screen.getByText(refetchMock[0].result.data.projects.data[0].name as string),
    ).toBeVisible();

    jest.useFakeTimers();
    jest.runTimersToTime(4005);
    jest.useRealTimers();

    await waitRequests();

    expect(
      screen.getByText(refetchMock[1].result.data.projects.data[0].name as string),
    ).toBeVisible();

    jest.useFakeTimers();
    jest.runTimersToTime(3005);
    jest.useRealTimers();

    await waitRequests();

    expect(
      screen.getByText(refetchMock[2].result.data.projects.data[0].name as string),
    ).toBeVisible();

    jest.clearAllTimers();
  });

  describe('пагинация', () => {
    it('загружает проекты', async () => {
      const paginationMock = mocks.pagination;
      await render(<ProjectsPage />, {
        mocks: paginationMock,
      });

      await waitRequests();

      const loadMoreButton = await waitFor(() => screen.getByText('Загрузить ещё'));
      const lastProjectName = secondPart[secondPart.length - 1].name as string;

      expect(screen.getByText('20 из 40')).toBeInTheDocument();
      expect(screen.queryByText(secondPart[0].name as string)).not.toBeInTheDocument();

      userEvent.click(loadMoreButton);

      await waitRequests();

      expect(screen.getByText('40 из 40')).toBeInTheDocument();
      expect(screen.queryByText(lastProjectName)).toBeInTheDocument();
      expect(loadMoreButton).not.toBeInTheDocument();
    });
  });

  describe('поиск', () => {
    it('отображается результат поиска', async () => {
      const searchMock = mocks.search;
      await render(<ProjectsPage />, {
        mocks: searchMock,
      });

      await waitRequests();

      await waitFor(() =>
        expect(screen.getByTestId(ProjectsPageView.testId.rootTitle)).toBeVisible(),
      );
      await waitFor(() => expect(screen.getByTestId(ProjectsPageView.testId.table)).toBeVisible());
      await waitFor(() =>
        expect(
          screen.getByText(searchMock[1].result.data.projects?.data[2].name as string),
        ).toBeVisible(),
      );

      const searchInput = screen.getByPlaceholderText('Введите название проекта или имя автора');
      fireEvent.input(searchInput, 'mockSearch');

      await waitFor(() =>
        expect(
          screen.getByText(searchMock[2].result.data.projects?.data[2].name as string),
        ).toBeVisible(),
      );
    });
  });
});
