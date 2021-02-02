import React from 'react';
import { Button, Modal, Text } from '@gpn-prototypes/vega-ui';

import { cnProjectsPage as cn } from '../cn-projects-page';

type ModalDeleteProjectProps = {
  isOpen: boolean;
  projectName?: string;
  onClose(): void;
  onCancelDelete(): void;
  onDeleteProject(): void;
};

const testId = {
  modal: 'ProjectsPage:modal',
  modalCancel: 'ProjectsPage:modal:button.cancel',
  modalConfirm: 'ProjectsPage:modal:button.confirm',
} as const;

type ModalDeleteProjectType = React.FC<ModalDeleteProjectProps> & {
  testId: typeof testId;
};

export const ModalDeleteProject: ModalDeleteProjectType = (props) => {
  const { isOpen, onClose, onCancelDelete, projectName, onDeleteProject } = props;
  return (
    <Modal
      hasOverlay
      hasCloseButton
      isOpen={isOpen}
      onClose={onClose}
      className={cn('Modal').toString()}
      data-testid={testId.modal}
    >
      <Modal.Header>
        <Text size="xs">Удаление проекта</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>{`Вы уверены, что хотите удалить проект «${projectName}» из\u00A0системы?`}</Text>
      </Modal.Body>
      <Modal.Footer className={cn('ModalFooter').toString()}>
        <Button
          size="m"
          onClick={onCancelDelete}
          view="primary"
          label="Нет, оставить"
          className={cn('ButtonCancel').toString()}
          data-testid={testId.modalCancel}
        />
        <Button
          size="m"
          onClick={onDeleteProject}
          view="ghost"
          label="Да, удалить"
          data-testid={testId.modalConfirm}
        />
      </Modal.Footer>
    </Modal>
  );
};

ModalDeleteProject.testId = testId;
