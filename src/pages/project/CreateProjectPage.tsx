import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Loader, Modal, Text } from '@gpn-prototypes/vega-ui';

import { ProjectStatusEnum } from '../../__generated__/types';
import { useSnackbar } from '../../providers/snackbar';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  useCreateProject,
  useDeleteProject2,
  useQueryRegionList,
  useUpdateProject2,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

const BLANK_PROJECT_ID = 'blank-project-id';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const history = useHistory();
  const snackbar = useSnackbar();

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const [blankProjectId, setBlankProjectId] = useState<string | undefined>(undefined);

  const [createProject, { error: createProjectError }] = useCreateProject();

  const [updateProject, { error: updateProjectError }] = useUpdateProject2();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteProject, { error: deleteProjectError }] = useDeleteProject2();

  useEffect(() => {
    let isCancelled = false;

    const data = localStorage.getItem(BLANK_PROJECT_ID);

    const call = async () => {
      const createProjectResult = await createProject();

      if (createProjectResult.data?.createProject?.result?.__typename === 'Project') {
        const projectId = createProjectResult.data.createProject?.result?.vid || undefined;

        localStorage.setItem(BLANK_PROJECT_ID, String(projectId));

        if (!isCancelled) {
          setBlankProjectId(projectId);
        }
      }

      if (createProjectResult.data?.createProject?.result?.__typename === 'Error') {
        const inlineCreateProjectError = createProjectResult.data?.createProject?.result;

        snackbar.addItem({
          key: `${inlineCreateProjectError.code}-create-error`,
          status: 'alert',
          message: inlineCreateProjectError.message,
        });
      }
    };

    if (data) {
      setBlankProjectId(data);
    } else {
      call();
    }

    return () => {
      isCancelled = true;
    };
  }, [createProject, snackbar]);

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = async (values: FormValues) => {
    const updateProjectResult = await updateProject({
      variables: {
        vid: blankProjectId,
        name: values.name,
        region: values.region && values.region !== 'NOT_SELECTED' ? values.region : undefined,
        coordinates: values.coordinates,
        description: values.description,
        yearStart: values.yearStart,
        status: ProjectStatusEnum.Unpublished,
        version: 1,
      },
    });

    if (updateProjectResult.data?.updateProject?.result?.__typename === 'Project') {
      const projectId = updateProjectResult.data.updateProject?.result?.vid || undefined;

      localStorage.removeItem(BLANK_PROJECT_ID);

      history.push(`/projects/show/${projectId}`);
    }

    if (updateProjectResult.data?.updateProject?.result?.__typename === 'Error') {
      const inlineUpdateProjectError = updateProjectResult.data?.updateProject?.result;

      snackbar.addItem({
        key: `${inlineUpdateProjectError.code}-update-error`,
        status: 'alert',
        message: inlineUpdateProjectError.message,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const handleAbort = async () => {
    await deleteProject({ variables: { vid: blankProjectId } });

    localStorage.removeItem(BLANK_PROJECT_ID);

    setIsModalOpen(false);

    history.push('/projects');
  };

  if (createProjectError || updateProjectError || queryRegionListError) {
    // eslint-disable-next-line no-console
    console.log({ createProjectError, updateProjectError, queryRegionListError });

    return null;
  }

  if (!blankProjectId || queryRegionListLoading) {
    return <Loader />;
  }

  return (
    <div className={cnPage()}>
      <ProjectForm
        mode="create"
        referenceData={referenceData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
      <Modal
        hasOverlay
        hasCloseButton
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        className={cnPage('Modal').toString()}
      >
        <Modal.Header>
          <Text size="xs">Создание проекта</Text>
        </Modal.Header>
        <Modal.Body>
          <Text>Вы уверены, что хотите прервать создание проекта?</Text>
        </Modal.Body>
        <Modal.Footer className={cnPage('ModalFooter').toString()}>
          <Button
            size="m"
            onClick={() => {
              setIsModalOpen(false);
            }}
            view="primary"
            label="Нет, продолжить заполнение"
            className={cnPage('ButtonCancel').toString()}
          />
          <Button size="m" onClick={handleAbort} view="ghost" label="Да, прервать" />
        </Modal.Footer>
      </Modal>
    </div>
  );
};
