import React, { useMemo, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';
import { FormApi } from 'final-form';
import createDecorator from 'final-form-focus';

import { ProjectStatusEnum } from '../../../../__generated__/types';
import { useDebouncedFunction } from '../../../../hooks/use-debounced-function';
import { createValidate, validators } from '../../../forms/validation';

import { Banner } from './Banner';
import { cnProjectForm } from './cn-form';
import { Footer } from './Footer';
import { DescriptionStep } from './steps';
import { FormProps, FormValues } from './types';

import './ProjectForm.css';

const focusOnErrors = createDecorator<FormValues>();

const currentYear = new Date().getFullYear();
const minYearStart = currentYear - 1;

const validator = createValidate<Partial<FormValues>>({
  name: [
    validators.required(undefined, () => 'Заполните обязательное поле'),
    validators.minLength(
      2,
      () => 'Название проекта не может быть менее 2 символов и более 256 символов',
    ),
    validators.maxLength(
      256,
      () => 'Название проекта не может быть менее 2 символов и более 256 символов',
    ),
  ],
  coordinates: [validators.maxLength(2000, () => 'Координаты не могут быть более 2000 символов')],
  yearStart: [
    validators.required(undefined, () => 'Заполните обязательное поле'),
    validators.isNumber(undefined, () => 'Значение должно быть годом'),
    validators.minLength(4, () => 'Год начала планирования проекта должен быть четырехзначным'),
    validators.min(
      minYearStart,
      () => `Год начала планирования не может быть раньше ${minYearStart} г.`,
    ),
  ],
  description: [
    validators.maxLength(2000, () => 'Описание проекта не может быть более 2000 символов'),
  ],
});

const steps = [{ title: 'Описание проекта', content: DescriptionStep }];

const testId = {
  form: 'ProjectForm:form',
  stepList: 'ProjectForm:stepList',
};

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { mode, initialValues, referenceData, onSubmit, onCancel } = formProps;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const submit = React.useCallback(
    (values: FormValues, formApi: FormApi<FormValues>) => {
      const data = {
        ...values,
        name: values.name?.trim(),
        description: values.description?.trim(),
        coordinates: values.coordinates?.trim(),
      };

      return onSubmit(data, formApi).then((errors) => {
        setHasUnsavedChanges(false);
        return errors;
      });
    },
    [onSubmit],
  );

  const handleStepChange = (step: number) => {
    setActiveStepIndex(step);
  };

  const handleCancel = (formApi: FormApi<FormValues>) => {
    setHasUnsavedChanges(false);
    if (typeof onCancel === 'function') {
      onCancel(formApi);
    }
  };

  const autoSaveDebounced = useDebouncedFunction(300, (form: FormApi<FormValues>) => {
    const { values, active, dirty, valid, validating, dirtySinceLastSubmit } = form.getState();

    if (values.status === ProjectStatusEnum.Unpublished && active) {
      form.change('status', ProjectStatusEnum.Blank);
    }

    if ((!valid || validating) && !dirtySinceLastSubmit) {
      return;
    }

    if (dirty) {
      form.submit();
    }
  });

  const Step = steps[activeStepIndex].content;

  const decorators = useMemo(() => [focusOnErrors], []);

  return (
    <Form
      initialValues={initialValues}
      keepDirtyOnReinitialize={hasUnsavedChanges}
      validate={validator}
      decorators={decorators}
      onSubmit={submit}
      render={({ form, handleSubmit, dirty }): React.ReactNode => (
        <>
          <Banner referenceData={referenceData} />
          <VegaForm onSubmit={handleSubmit} className={cnProjectForm()} data-testId={testId.form}>
            <div className={cnProjectForm('Content')}>
              <NavigationList className={cnProjectForm('Navigation')} data-testId={testId.stepList}>
                {steps.map(({ title }, index) => (
                  <NavigationList.Item key={title}>
                    {(props): React.ReactNode => (
                      <button
                        type="button"
                        onClick={(): void => setActiveStepIndex(index)}
                        className={cnProjectForm('NavigationButton').mix(props.className)}
                      >
                        {title}
                      </button>
                    )}
                  </NavigationList.Item>
                ))}
              </NavigationList>
              <Step mode={mode} referenceData={referenceData} form={form} />
            </div>
            <Footer
              mode={mode}
              isFormDirty={dirty}
              activeStep={activeStepIndex}
              stepsAmount={steps.length}
              onStepChange={handleStepChange}
              onCancel={() => {
                handleCancel(form);
              }}
            />
            <FormSpy
              subscription={{ dirtyFields: true, values: true, active: true }}
              onChange={(formState) => {
                setHasUnsavedChanges(Object.keys(formState.dirtyFields).length > 0);
                if (mode === 'create') {
                  autoSaveDebounced(form);
                }
              }}
            />
          </VegaForm>
        </>
      )}
    />
  );
};
