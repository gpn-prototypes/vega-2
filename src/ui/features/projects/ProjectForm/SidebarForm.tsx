import React, { ChangeEvent } from 'react';
import { Form } from 'react-final-form';
import {
  Button,
  FileInput,
  Form as VegaForm,
  ProgressSpin,
  Sidebar,
  Text,
  usePortalRender,
} from '@gpn-prototypes/vega-ui';

import { cnSidebarForm } from './cn-form';
import { SidebarItem } from './SidebarItem';
import { getUploadStatistics } from './utils';

type SidebarFormProps = {
  isOpen: boolean;
  isMinimized: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onMaximizeSidebar: () => void;
  onMinimizeSidebar: () => void;
  fileList: File[];
  addFiles: (files: File[]) => void;
  removeFile: (name: string) => void;
};

// Понадобится в onSubmit

// type FormValues = {
//   [key: string]: {
//     category: string;
//     comment: string;
//   };
// };

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

export const SidebarForm: React.FC<SidebarFormProps> = (props) => {
  const {
    isOpen,
    isMinimized,
    onCloseSidebar,
    onMaximizeSidebar,
    onMinimizeSidebar,
    fileList,
    addFiles,
    removeFile,
  } = props;

  const { filesLeftMessage, timeLeftMessage, progressPercent } = getUploadStatistics(fileList);

  const onSubmit = (): void => {
    onMinimizeSidebar();
  };

  const { renderPortalWithTheme } = usePortalRender();

  return renderPortalWithTheme(
    <Form
      onSubmit={onSubmit}
      mutators={{
        clear: ([name], state, { changeValue }): void => {
          changeValue(state, name, () => undefined);
        },
      }}
      render={({ handleSubmit, form }): React.ReactNode => (
        <VegaForm onSubmit={handleSubmit}>
          <Sidebar
            isOpen={isOpen}
            isMinimized={isMinimized}
            onOverlayClick={onMinimizeSidebar}
            onMinimize={onMinimizeSidebar}
            onClose={onCloseSidebar}
            className={isMinimized ? cnSidebarForm('Minimized') : undefined}
          >
            {isMinimized ? (
              <>
                <Sidebar.Header hasMinimizeButton={false}>Загрузка файлов</Sidebar.Header>
                <Sidebar.Body>
                  <div className={cnSidebarForm('Minimized-container')} onClick={onMaximizeSidebar}>
                    <ProgressSpin size="m" progress={progressPercent} />
                    <div className={cnSidebarForm('Minimized-statistics')}>
                      <Text size="s" view="primary">
                        {filesLeftMessage}
                      </Text>
                      <Text size="xs" view="ghost">
                        {timeLeftMessage}
                      </Text>
                    </div>
                  </div>
                </Sidebar.Body>
              </>
            ) : (
              <>
                <Sidebar.Header>Загрузка файлов</Sidebar.Header>
                <Sidebar.Body>
                  {fileList.map(({ name, size, lastModified }) => (
                    <SidebarItem
                      key={name}
                      name={name}
                      size={size}
                      timestamp={lastModified}
                      onRemove={(nameWithoutDots): void => {
                        form.mutators.clear(nameWithoutDots);
                        removeFile(name);
                      }}
                    />
                  ))}
                </Sidebar.Body>
                <Sidebar.Footer className={cnSidebarForm('Footer')}>
                  {/*
                    Заменить на компонент FileField из ui-kit:
                    https://github.com/gpn-prototypes/ui-kit/tree/master/src/components/FileField
                    https://consta-uikit.vercel.app/?path=/story/components-filefield--playground
                  */}
                  <FileInput
                    id="SidebarForm-input"
                    className={cnSidebarForm('Footer-Button').toString()}
                    onChange={(e: DragEvent | ChangeEvent): void => {
                      if (e.target instanceof HTMLInputElement) {
                        if (e.target.files !== null) {
                          addFiles(Array.from(e.target.files));
                        }
                      }
                    }}
                    multiple
                  >
                    {(buttonProps): React.ReactNode => (
                      <Button {...buttonProps} size="s" view="ghost" label="Загрузить еще файл" />
                    )}
                  </FileInput>
                  <Button
                    size="s"
                    view="primary"
                    label="Сохранить"
                    type="submit"
                    className={cnSidebarForm('Footer-Button').toString()}
                  />
                </Sidebar.Footer>
              </>
            )}
          </Sidebar>
        </VegaForm>
      )}
    />,
    document.body,
  );
};
