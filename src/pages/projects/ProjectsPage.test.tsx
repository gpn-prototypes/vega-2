import React from 'react';
import * as tl from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../__generated__/types';
import { mountApp } from '../../../test-utils';
import { createProject } from '../../../test-utils/data-generators';

import { ProjectsTableListDocument } from './__generated__/projects';
import { mocks } from './__mocks__/mocks';
import { EditedAt } from './ProjectsTable/EditedAt';
import { ModalDeleteProject } from './ModalDeleteProject';
import { ProjectsPage } from './ProjectsPage';
import { ProjectsPageView } from './ProjectsPageView';
import { ProjectsTable } from './ProjectsTable';

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
  test('отрисовывается индикатор загрузки', async () => {
    const defaultMock = mocks.default;
    const { $ } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    expect($.getByTestId(ProjectsPageView.testId.loader)).toBeVisible();
  });

  test('отрисовывается страница c данными', async () => {
    const defaultMock = mocks.default;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: defaultMock,
    });

    await waitRequest();

    expect($.getByTestId(ProjectsPageView.testId.rootTitle)).toBeVisible();
    expect($.getByTestId(ProjectsPageView.testId.table)).toBeVisible();
    expect($.getByText(defaultMock[0].result.data.projects.data[2].name)).toBeVisible();
  });

  test.todo('проект помечается избранным');

  test.skip('проект удаляется', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    const projectName = deleteProjectMock[0].result.data.projects?.data[0].name as string;
    const nameCells = await tl.waitFor(() => $.getAllByTestId(ProjectsTable.testId.projectName));

    expect(tl.screen.getByText(projectName)).toBeVisible();

    openModalRemoveProject();

    expect(nameCells.length).toBe(3);
    expect($.getByTestId(ModalDeleteProject.testId.modal)).toBeVisible();

    userEvent.click($.getByTestId(ModalDeleteProject.testId.modalConfirm));

    await waitRequest();

    const newNameCells = await tl.waitFor(() => $.getAllByTestId(ProjectsTable.testId.projectName));

    const firstProjectName = newNameCells[0].textContent;

    const nextProjectName = deleteProjectMock[2].result.data.projects?.data[0].name;

    expect(firstProjectName).toBe(nextProjectName);
    expect(newNameCells.length).toBe(2);
  });

  test('модальное окно закрывается при отмене удаления', async () => {
    const deleteProjectMock = mocks.deleteProject;

    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = $.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    userEvent.click($.getByTestId(ModalDeleteProject.testId.modalCancel));

    expect(modal).not.toBeInTheDocument();
  });

  test('модальное окно закрывается', async () => {
    const deleteProjectMock = mocks.deleteProject;
    const { $, waitRequest } = await mountApp(<ProjectsPage />, {
      mocks: deleteProjectMock,
    });

    await waitRequest();

    openModalRemoveProject();

    const modal = $.getByTestId(ModalDeleteProject.testId.modal);

    expect(modal).toBeInTheDocument();

    userEvent.click($.getByLabelText('Кнопка закрытия модального окна'));

    expect(modal).not.toBeInTheDocument();
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
  });
});
