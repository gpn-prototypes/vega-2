import React from 'react';
import { Field } from 'react-final-form';
import { Attach, Form as VegaForm, IconTrash, TextField } from '@gpn-prototypes/vega-ui';

import { cnSidebarForm } from './cn-form';
import { formatBytes, getExtension } from './utils';

type SidebarItemProps = {
  name: string;
  size: number;
  timestamp: number;
  onRemove: (nameWithoutDots: string) => void;
};

const EXCLUDED_EXTENSIONS = ['', 'exe'];
const SIZE_LIMIT = 100 * 1024 * 1024; // 100 Мб

export const SidebarItem: React.FC<SidebarItemProps> = ({ name, size, timestamp, onRemove }) => {
  const formatedSize = formatBytes(size, 1);
  const formatedDate = new Date(timestamp).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  const description = `${formatedSize} ${formatedDate}`;
  const extension = getExtension(name);

  const nameWithoutDots = name.replace('.', '');

  let errorText;

  if (EXCLUDED_EXTENSIONS.includes(extension)) {
    errorText = 'Загружаемый файл имеет недопустимый формат.';
  }

  if (size > SIZE_LIMIT) {
    errorText = 'Загружаемый файл превышает допустимый лимит 100 Мб.';
  }

  return (
    <VegaForm.Row space="xl" className={cnSidebarForm('Row')}>
      <Attach
        fileName={name}
        fileDescription={description}
        fileExtension={extension}
        errorText={errorText}
        withAction
        buttonIcon={IconTrash}
        buttonTitle="Удалить"
        onButtonClick={(e): void => {
          e.stopPropagation();
          onRemove(nameWithoutDots);
        }}
      />
      <Field
        name={`${nameWithoutDots}.category`}
        render={({ input }): React.ReactNode => (
          <TextField
            id={`file-${name}-category`}
            size="s"
            width="full"
            placeholder="Категория"
            name={input.name}
            value={input.value}
            onChange={({ e }): void => input.onChange(e)}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
          />
        )}
      />
      <Field
        name={`${nameWithoutDots}.comment`}
        render={({ input }): React.ReactNode => (
          <TextField
            id={`file-${name}-comment`}
            size="s"
            width="full"
            placeholder="Комментарий"
            name={input.name}
            value={input.value}
            onChange={({ e }): void => input.onChange(e)}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
          />
        )}
      />
    </VegaForm.Row>
  );
};
