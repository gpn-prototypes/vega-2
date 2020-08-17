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
  openSidebar: () => void;
  closeSidebar: () => void;
  maximizeSidebar: () => void;
  minimizeSidebar: () => void;
  fileList: File[];
  addFiles: (files: File[]) => void;
  removeFile: (name: string) => void;
};

type FormValues = {
  [key: string]: {
    category: string;
    comment: string;
  };
};

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

export const SidebarForm: React.FC<SidebarFormProps> = (props) => {
  const {
    isOpen,
    isMinimized,
    closeSidebar,
    maximizeSidebar,
    minimizeSidebar,
    fileList,
    addFiles,
    removeFile,
  } = props;

  const { filesLeftMessage, timeLeftMessage, progressPercent } = getUploadStatistics(fileList);

  const onSubmit = (values: FormValues): void => {
    // eslint-disable-next-line no-console
    console.log('SidebarForm, onSubmit:', values);
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
      render={({ handleSubmit }): React.ReactNode => (
        <VegaForm onSubmit={handleSubmit}>
          <Sidebar
            isOpen={isOpen}
            isMinimized={isMinimized}
            onOverlayClick={minimizeSidebar}
            onMinimize={minimizeSidebar}
            onClose={closeSidebar}
            className={isMinimized ? cnSidebarForm('Minimized') : undefined}
          >
            {isMinimized ? (
              <>
                <Sidebar.Header hasMinimizeButton={false}>Загрузка файлов</Sidebar.Header>
                <Sidebar.Body>
                  <div className={cnSidebarForm('Minimized-container')} onClick={maximizeSidebar}>
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
                      onRemove={(): void => removeFile(name)}
                    />
                  ))}
                </Sidebar.Body>
                <Sidebar.Footer className={cnSidebarForm('Footer')}>
                  {/*
                    Заменить на компонент FileField из ui-kit:
                    https://github.com/gpn-prototypes/ui-kit/tree/master/src/components/FileField
                    https://ui-kit.gpn.vercel.app/?path=/story/components-filefield--playground
                  */}
                  <FileInput
                    id="SidebarForm-input"
                    className={cnSidebarForm('Footer-Button').toString()}
                    onChange={(e: DragEvent | ChangeEvent): void => {
                      if (e.target instanceof HTMLInputElement) {
                        // eslint-disable-next-line no-console
                        console.log(e.target.files);

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
                    // @ts-expect-error
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
