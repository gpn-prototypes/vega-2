import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Button, Modal, Text } from '@gpn-prototypes/vega-ui';
import { Location } from 'history';

import { cnPage } from './cn-page';

type Props = {
  when: boolean;
  navigate: (path: string | null) => Promise<void>;
};

export const RouteLeavingGuard: React.FC<Props> = ({ when, navigate }) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    if (nextLocation.pathname === '/login') {
      return true;
    }

    setIsModalOpen(true);
    setLastLocation(nextLocation);

    return false;
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAbort = () => {
    setIsLoading(true);

    const path = lastLocation ? lastLocation.pathname : null;
    navigate(path);
  };

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <Modal
        hasOverlay
        hasCloseButton
        isOpen={isModalOpen}
        onClose={handleClose}
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
            size="s"
            view="primary"
            label="Нет, продолжить заполнение"
            type="button"
            className={cnPage('ButtonClose').toString()}
            onClick={handleClose}
          />
          <Button
            size="s"
            view="ghost"
            loading={isLoading}
            label="Да, прервать"
            type="button"
            onClick={handleAbort}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
