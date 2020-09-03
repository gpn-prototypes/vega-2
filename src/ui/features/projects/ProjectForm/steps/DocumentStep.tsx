import React from 'react';
import {
  FileDropzone,
  FileIconDoc,
  FileIconMp4,
  FileIconPdf,
  FileIconPtt,
  FileIconXls,
  Text,
  useSidebar,
} from '@gpn-prototypes/vega-ui';

import { cnDocumentStep, cnProjectForm } from '../cn-form';
import { SidebarForm } from '../SidebarForm';
import { useFileList } from '../use-file-list';

const fileIcons = [FileIconDoc, FileIconXls, FileIconPtt, FileIconPdf, FileIconMp4];

type StepProps = {};

export const DocumentStep: React.FC<StepProps> = () => {
  const {
    state: { isOpen, isMinimized },
    open: onOpenSidebar,
    close: onCloseSidebar,
    maximize: onMaximizeSidebar,
    minimize: onMinimizeSidebar,
  } = useSidebar({
    isOpen: false,
    isMinimized: false,
  });

  const { fileList, addFiles, removeFile } = useFileList();

  if (fileList.length === 0 && isOpen) {
    onCloseSidebar();
  }

  const handleDrop = (files: FileList | null): void => {
    if (files !== null) {
      addFiles(Array.from(files));
      onOpenSidebar();
      onMaximizeSidebar();
    }
  };

  return (
    <div className={cnProjectForm('Step').mix(cnDocumentStep())}>
      <Text view="primary" size="m" className={cnDocumentStep('Status').toString()}>
        Пока ни одного документа не добавлено
      </Text>
      <Text view="secondary" size="s" className={cnDocumentStep('Description').toString()}>
        Здесь будут лежать связанные с проектом файлы и документы. Добавить их можно загрузкой
        нового либо выбором из существующих в общем пространстве.
      </Text>
      <FileDropzone
        fullscreen={!isOpen}
        onDrop={handleDrop}
        className={cnDocumentStep('FileDropzone')}
      >
        <Text view="secondary" size="s" className={cnDocumentStep('FileDropzone-title').toString()}>
          Загрузите файлы простым переносом или&nbsp;по кнопке ниже.
        </Text>
        <FileDropzone.Input id="input" label="Загрузить файл" multiple />
        <FileDropzone.Fullscreen>
          <div className={cnDocumentStep('FileDropzone-fullscreen')}>
            <div className={cnDocumentStep('FileDropzone-icons-block')}>
              {fileIcons.map((Icon, index) => (
                <Icon
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  size="m"
                  className={cnDocumentStep('FileDropzone-icon').toString()}
                />
              ))}
            </div>
            <Text view="secondary" size="3xl">
              Загрузите документы
            </Text>
          </div>
        </FileDropzone.Fullscreen>
      </FileDropzone>
      <SidebarForm
        isOpen={isOpen}
        isMinimized={isMinimized}
        onOpenSidebar={onOpenSidebar}
        onCloseSidebar={onCloseSidebar}
        onMaximizeSidebar={onMaximizeSidebar}
        onMinimizeSidebar={onMinimizeSidebar}
        fileList={fileList}
        addFiles={addFiles}
        removeFile={removeFile}
      />
    </div>
  );
};
