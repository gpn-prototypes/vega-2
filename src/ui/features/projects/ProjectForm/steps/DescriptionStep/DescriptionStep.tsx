/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Field, FieldInputProps, FieldMetaState } from 'react-final-form';
import {
  Combobox,
  Form as VegaForm,
  Text,
  TextField as BaseTextField,
} from '@gpn-prototypes/vega-ui';
import { FormApi } from 'final-form';

import { ProjectTypeEnum } from '../../../../../../__generated__/types';
import { ReferenceDataType } from '../../../../../../pages/project/types';
import { cnDescriptionStep, cnProjectForm } from '../../cn-form';
import { FormMode } from '../../types';

type SelectOption = {
  label: string;
  value: string | number;
};

type StepProps = {
  mode: FormMode;
  referenceData: ReferenceDataType;
  form: FormApi;
};

const typeOptions = [{ label: 'Геологоразведочный', value: ProjectTypeEnum.Geo }];
const typeInitialValue = typeOptions[0].value;

const getYearStartOptions = (): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = -1; i < 11; i += 1) {
    const year = currentYear + i;
    const option = {
      label: `${year}`,
      value: year.toString(),
    };

    options.push(option);
  }

  return options;
};

const notSelectedOption = { label: 'Не выбрано', value: 'NOT_SELECTED' };

type TextFieldProps<T = any> = {
  name: string;
  placeholder: string;
  input: FieldInputProps<T>;
  meta: FieldMetaState<T>;
};

const TextField: React.FC<TextFieldProps> = (props) => {
  const { input, meta, name, placeholder } = props;

  const submitErrorText =
    meta.submitError && !meta.dirtySinceLastSubmit ? meta.submitError : undefined;
  const showError = Boolean(meta.error || submitErrorText) && meta.submitFailed;
  const errorText = meta.error || submitErrorText;

  return (
    <>
      <BaseTextField
        id={name}
        size="s"
        width="full"
        name={input.name}
        state={showError ? 'alert' : undefined}
        placeholder={placeholder}
        autoComplete="off"
        value={input.value}
        onChange={({ e }): void => input.onChange(e)}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
      />
      {showError && (
        <Text
          size="xs"
          lineHeight="xs"
          view="alert"
          className={cnDescriptionStep('ErrorText').toString()}
        >
          {errorText}
        </Text>
      )}
    </>
  );
};

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { mode, referenceData, form } = props;
  const { regionList } = referenceData;

  const regionOptions =
    regionList?.map((region) => ({
      label: region?.name || '',
      value: region?.vid || '',
    })) || [];

  const [yearStartOptions, setYearStartOptions] = useState(getYearStartOptions());
  const yearStartInitialValue = mode === 'create' ? yearStartOptions[2].value : undefined;

  const getItemLabel = (option: SelectOption): string => option.label;

  const updateYearStartOptions = (option: string): void => {
    setYearStartOptions([{ label: option, value: option }, ...yearStartOptions]);
  };

  React.useEffect(() => {
    const year = form.getFieldState('yearStart');
    const inList = yearStartOptions.find(
      ({ value }) => value.toString() === year?.initial.toString(),
    );

    if (year?.initial && !inList) {
      setYearStartOptions([
        { label: year.initial.toString(), value: year.initial.toString() },
        ...yearStartOptions,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <Field
            name="name"
            render={({ input, meta }): React.ReactNode => {
              return (
                <TextField
                  input={input}
                  meta={meta}
                  name="name"
                  placeholder="Придумайте название проекта"
                />
              );
            }}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="region" space="2xs">
            Регион
          </VegaForm.Label>
          <Field
            name="region"
            render={({ input }): React.ReactNode => (
              <Combobox
                id="region"
                size="s"
                options={
                  input.value && input.value !== 'NOT_SELECTED'
                    ? [notSelectedOption, ...regionOptions]
                    : regionOptions
                }
                getOptionLabel={getItemLabel}
                placeholder="Выберите регион"
                value={regionOptions.find(({ value }) => value === input.value)}
                onChange={(option: SelectOption | null): void => {
                  let value = null;

                  if (option !== null && option.value !== 'NOT_SELECTED') {
                    value = option.value;
                  }

                  input.onChange(value);
                }}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="type" space="2xs">
            Тип проекта
          </VegaForm.Label>
          <Field
            name="type"
            initialValue={typeInitialValue}
            render={({ input }): React.ReactNode => (
              <Combobox
                id="type"
                size="s"
                options={typeOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите тип проекта"
                disabled
                value={typeOptions.find(({ value }) => value === input.value)}
                onChange={(value): void => {
                  input.onChange(value?.value);
                }}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="coordinates" space="2xs">
            Система координат
          </VegaForm.Label>
          <Field
            allowNull
            parse={(v) => v}
            name="coordinates"
            render={({ input, meta }): React.ReactNode => {
              return (
                <TextField
                  input={input}
                  meta={meta}
                  name="coordinates"
                  placeholder="Укажите систему координат"
                />
              );
            }}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="yearStart" space="2xs">
            Год начала планирования
          </VegaForm.Label>
          <Field
            name="yearStart"
            initialValue={yearStartInitialValue}
            render={({ input, meta }): React.ReactNode => {
              const submitErrorText =
                meta.submitError && !meta.dirtySinceLastSubmit ? meta.submitError : undefined;
              const showError = Boolean(meta.error || submitErrorText) && meta.submitFailed;
              const errorText = meta.error || submitErrorText;

              return (
                <>
                  <Combobox
                    id="yearStart"
                    className={
                      showError ? cnDescriptionStep('ComboboxError').toString() : undefined
                    }
                    size="s"
                    options={yearStartOptions}
                    getOptionLabel={getItemLabel}
                    onCreate={(option) => {
                      updateYearStartOptions(option);
                      input.onChange(option);
                    }}
                    placeholder="Выберите год"
                    value={yearStartOptions.find(
                      ({ value }) => value.toString() === input.value.toString(),
                    )}
                    onChange={(value: SelectOption | null): void => {
                      input.onChange(value?.value);
                    }}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                  />
                  {showError && (
                    <Text
                      size="xs"
                      lineHeight="xs"
                      view="alert"
                      className={cnDescriptionStep('ErrorText').toString()}
                    >
                      {errorText}
                    </Text>
                  )}
                </>
              );
            }}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="description" space="2xs">
            Описание проекта
          </VegaForm.Label>
          <Field
            name="description"
            allowNull
            parse={(v) => v}
            render={({ input }): React.ReactNode => (
              <BaseTextField
                id="description"
                type="textarea"
                minRows={3}
                maxRows={9}
                size="s"
                width="full"
                placeholder="Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие"
                name={input.name}
                value={input.value}
                onChange={({ e }): void => input.onChange(e)}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
    </div>
  );
};
