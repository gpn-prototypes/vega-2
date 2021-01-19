import React from 'react';
import * as tl from '@testing-library/react';

import { mountApp } from '../../../test-utils';

import { mocks } from './__mocks__/mocks';
import { EditedAt } from './ProjectsTable/EditedAt';
import { ModalDeleteProject } from './ModalDeleteProject';
import { ProjectsPage } from './ProjectsPage';
import { ProjectsPageView } from './ProjectsPageView';
import { ProjectsTable } from './ProjectsTable';

function openModalRemoveProject(projectName: string) {
  tl.fireEvent.mouseOver(tl.screen.getByText(projectName));
  tl.fireEvent.click(tl.screen.getByTestId(EditedAt.testId.buttonMenu));
  tl.fireEvent.click(tl.screen.getByTestId(ProjectsPage.testId.projectRemove));
}

describe('ProjectsPage', () => {
  test('Отрисовывается страница c данными', async () => {
    const defaultMock = mocks.default;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequest();

    expect($.getByTestId(ProjectsPageView.testId.rootTitle)).toBeInTheDocument();
    expect($.getByTestId(ProjectsPageView.testId.table)).toBeInTheDocument();
    expect($.getByText(defaultMock[0].result.data.projects.data[2].name)).toBeInTheDocument();
  });

  test('Отрисовывается индикатор загрузки', async () => {
    const defaultMock = mocks.default;
    const { $ } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    expect($.getByTestId(ProjectsPageView.testId.loader)).toBeInTheDocument();
  });

  test.todo('Проект помечается избранным');

  test('Проект удаляется', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    const nameProject = deleteProjectMock[0].result.data.projects?.data[0].name ?? '';

    openModalRemoveProject(nameProject);

    expect($.getByTestId(ModalDeleteProject.testId.modal)).toBeInTheDocument();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId(ModalDeleteProject.testId.modalConfirm));
    });

    await waitRequest();

    const firstProjectName = $.getAllByTestId(ProjectsTable.testId.projectName)[0].textContent;

    const nextProjectName = deleteProjectMock[2].result.data.projects?.data[0].name;

    expect(firstProjectName).toBe(nextProjectName);
  });

  test('Модальное окно закрывается при отмене удаления', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    const nameProject = deleteProjectMock[0].result.data.projects?.data[0].name ?? '';

    openModalRemoveProject(nameProject);

    const modal = $.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    tl.fireEvent.click($.getByTestId(ModalDeleteProject.testId.modalCancel));

    expect(modal).not.toBeInTheDocument();
  });

  test('Модальное окно закрывается', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    const nameProject = deleteProjectMock[0].result.data.projects?.data[0].name ?? '';

    openModalRemoveProject(nameProject);

    const modal = $.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    tl.fireEvent.click($.getByLabelText('Кнопка закрытия модального окна'));

    expect(modal).not.toBeInTheDocument();
  });
});
