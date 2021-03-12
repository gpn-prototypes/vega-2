import React, { useState } from 'react';
import { matchPath, Prompt } from 'react-router-dom';
import { Button, Modal, Text } from '@gpn-prototypes/vega-ui';
import { Location } from 'history';

import { cnPage } from './cn-page';

type Props = {
  when: boolean;
  navigate: (path: string | null) => Promise<void>;
  whiteRoutes?: string[];
};

export const RouteLeavingGuard: React.FC<Props> = ({ when, navigate, whiteRoutes }) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    // В другой вкладке было мерцание модалки. Добавил доп.проверку, чтобы его избежать
    const isWhiteRoute = whiteRoutes?.some((route) => {
      return (
        matchPath(nextLocation.pathname, {
          path: route,
          exact: true,
        }) !== null || route === nextLocation.pathname
      );
    });

    if (isWhiteRoute) {
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
        testId="RouteLeavingGuardModal"
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
            data-testid="RouteLeavingGuardModal:button:close"
            className={cnPage('ButtonClose').toString()}
            onClick={handleClose}
          />
          <Button
            size="s"
            view="ghost"
            loading={isLoading}
            label="Да, прервать"
            data-testid="RouteLeavingGuardModal:button:abort"
            type="button"
            onClick={handleAbort}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
