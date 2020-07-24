import React, { useState } from 'react';
import {
  Attach,
  Button,
  FileDropzone,
  Form as VegaForm,
  IconTrash,
  Sidebar,
  Text,
  TextField,
  useSidebar,
} from '@gpn-prototypes/vega-ui';

import { cnForm } from '../cn-form';

type StepProps = {};

type SidebarItemProps = {
  name: string;
  size: number;
  timestamp: number;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ name }) => {
  const desc = '1,5 Mб 21.02.2019, 14:12';
  const ext = name.split('.').pop();
  return (
    <VegaForm.Row space="xl" className={cnForm('Step3-SidebarForm-Row')}>
      <Attach
        fileName={name}
        fileDescription={desc}
        fileExtension={ext}
        withAction
        buttonIcon={IconTrash}
        buttonTitle="Удалить"
        onButtonClick={(e): void => {
          e.stopPropagation();
          // eslint-disable-next-line no-console
          console.log('onButtonClick');
        }}
      />
      <TextField
        id={`file-${name}-category`}
        size="s"
        width="full"
        placeholder="Категория"
        name="category"
      />
      <TextField
        id={`file-${name}-comment`}
        size="s"
        width="full"
        placeholder="Комментарий"
        name="comment"
      />
    </VegaForm.Row>
  );
};

export const Step3: React.FC<StepProps> = () => {
  const {
    state: { isOpen, isMinimized },
    close: handleClose,
    open: handleOpen,
    // maximize: handleMaximize,
    minimize: handleMinimize,
  } = useSidebar({
    isOpen: false,
    isMinimized: false,
  });

  const [fileList, setFileList] = useState<File[]>([]);

  const handleDrop = (files: FileList | null): void => {
    // eslint-disable-next-line no-console
    console.log(files);

    if (files === null) {
      return;
    }

    const arr = Array.from(files);
    setFileList(arr);

    handleOpen();
  };

  return (
    <>
      <Text view="primary" size="m" className={cnForm('Step3-title').toString()}>
        Пока ни одного документа не добавлено
      </Text>
      <Text view="secondary" size="s" className={cnForm('Step3-description').toString()}>
        Здесь будут лежать связанные с проектом файлы и документы. Добавить их можно загрузкой
        нового, либо выбором из существующих в общем пространстве.
      </Text>
      <FileDropzone onDrop={handleDrop}>
        <Text view="secondary" size="s" className={cnForm('Step3-status').toString()}>
          Загрузите файлы простым переносом или по кнопке ниже.
        </Text>
        <FileDropzone.Input id="random-id" label="Загрузить файл" multiple />
      </FileDropzone>
      <Sidebar
        isOpen={isOpen}
        isMinimized={isMinimized}
        onOverlayClick={handleClose}
        onMinimize={handleMinimize}
        onClose={handleClose}
      >
        {isMinimized ? (
          <>
            <Sidebar.Header hasMinimizeButton={false}>Загрузка файлов</Sidebar.Header>
            <Sidebar.Body>Minimized body</Sidebar.Body>
          </>
        ) : (
          <>
            <Sidebar.Header>Загрузка файлов</Sidebar.Header>
            <Sidebar.Body>
              {fileList.map(({ name, size, lastModified }) => (
                <SidebarItem key={name} name={name} size={size} timestamp={lastModified} />
              ))}
            </Sidebar.Body>
            <Sidebar.Footer className={cnForm('Step3-SidebarForm-Footer')}>
              <Button
                size="s"
                view="ghost"
                label="Загрузить еще файл"
                className={cnForm('Step3-SidebarForm-Footer-Button').toString()}
              />
              <Button
                size="s"
                view="primary"
                label="Сохранить"
                className={cnForm('Step3-SidebarForm-Footer-Button').toString()}
              />
            </Sidebar.Footer>
          </>
        )}
      </Sidebar>
    </>
  );
};
