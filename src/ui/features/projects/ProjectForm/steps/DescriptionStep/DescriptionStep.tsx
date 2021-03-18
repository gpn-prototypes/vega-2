import React from 'react';
import { Field } from 'react-final-form';
import { Combobox, Form as VegaForm } from '@gpn-prototypes/vega-ui';

import { ProjectTypeEnum } from '../../../../../../__generated__/types';
import { ReferenceDataType } from '../../../../../../pages/project/types';
import { TextField } from '../../../../../core';
import { cnDescriptionStep, cnProjectForm } from '../../cn-form';

type SelectOption = {
  label: string;
  value: string | number;
};

export type StepProps = {
  referenceData: ReferenceDataType;
};

const typeOptions = [{ label: 'Геологоразведочный', value: ProjectTypeEnum.Geo }];
const typeInitialValue = typeOptions[0].value;

const trimFormat = (value?: string) => value?.trim();

const testId = {
  name: 'ProjectForm:field:name',
  nameLabel: 'ProjectForm:label:name',
  region: 'ProjectForm:field:region',
  regionLabel: 'ProjectForm:label:region',
  coordinates: 'ProjectForm:field:coordinates',
  coordinatesLabel: 'ProjectForm:label:coordinates',
  type: 'ProjectForm:field:type',
  typeLabel: 'ProjectForm:label:type',
  description: 'ProjectForm:field:description',
  descriptionLabel: 'ProjectForm:label:description',
} as const;

type DescriptionStepType = React.FC<StepProps> & {
  testId: typeof testId;
};

export const DescriptionStep: DescriptionStepType = (props) => {
  const { referenceData } = props;
  const { regionList } = referenceData;

  const regionOptions =
    regionList?.map((region) => ({
      label: region?.name || /* istanbul ignore next */ '',
      value: region?.vid || /* istanbul ignore next */ '',
    })) || /* istanbul ignore next */ [];

  const getItemLabel = (option: SelectOption): string => option.label;

  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs" data-testid={testId.nameLabel}>
            Название проекта
          </VegaForm.Label>
          <Field
            format={trimFormat}
            name="name"
            formatOnBlur
            render={({ input, meta }): React.ReactNode => {
              return (
                <TextField
                  input={input}
                  meta={meta}
                  name="name"
                  placeholder="Введите название проекта"
                  testId={testId.name}
                />
              );
            }}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="region" space="2xs" data-testid={testId.regionLabel}>
            Регион
          </VegaForm.Label>
          <Field
            name="region"
            render={({ input }): React.ReactNode => (
              <Combobox
                id="region"
                size="s"
                options={regionOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите регион"
                value={regionOptions.find(({ value }) => value === input.value)}
                onChange={(option: SelectOption | null): void => {
                  input.onChange(option?.value ?? null);
                }}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                data-testid={testId.region}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="type" space="2xs" data-testid={testId.typeLabel}>
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
                data-testid={testId.type}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="coordinates" space="2xs" data-testid={testId.coordinatesLabel}>
            Система координат
          </VegaForm.Label>
          <Field
            allowNull
            parse={(v) => v}
            name="coordinates"
            format={trimFormat}
            formatOnBlur
            render={({ input, meta }): React.ReactNode => {
              return (
                <TextField
                  input={input}
                  meta={meta}
                  name="coordinates"
                  placeholder="Укажите систему координат"
                  testId={testId.coordinates}
                />
              );
            }}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="description" space="2xs" data-testid={testId.descriptionLabel}>
            Описание проекта
          </VegaForm.Label>
          <Field
            name="description"
            allowNull
            format={trimFormat}
            formatOnBlur
            parse={
              /* istanbul ignore next */
              (v) => v
            }
            render={({ input, meta }): React.ReactNode => (
              <TextField
                id="description"
                type="textarea"
                minRows={3}
                maxRows={9}
                input={input}
                meta={meta}
                name={input.name}
                size="s"
                width="full"
                placeholder="Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие"
                testId={testId.description}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
    </div>
  );
};

DescriptionStep.testId = testId;
