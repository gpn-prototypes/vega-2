import React, { useMemo, useRef, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';
import { FormApi, SubmissionErrors } from 'final-form';
import createDecorator from 'final-form-focus';
import { intersection } from 'ramda';

import { ProjectStatusEnum } from '../../../../__generated__/types';
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

export const validator = createValidate<Partial<FormValues>>({
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

  const submitPromiseRef = useRef<Promise<SubmissionErrors | void>>();
  const submit = React.useCallback(
    (values: FormValues, formApi: FormApi<FormValues>) => {
      const data = {
        ...values,
        name: values.name?.trim(),
        description: values.description?.trim(),
        coordinates: values.coordinates?.trim(),
      };

      let activePromise = submitPromiseRef.current;

      if (activePromise !== undefined) {
        activePromise = activePromise.then(() => onSubmit(data, formApi));
      } else {
        activePromise = onSubmit(data, formApi);
      }

      return activePromise.then((errors) => {
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

  const prevActive = useRef<string | undefined>(undefined);

  const autoSave = (form: FormApi<FormValues>) => {
    const {
      values,
      active,
      dirty,
      validating,
      dirtySinceLastSubmit,
      dirtyFields,
      errors,
    } = form.getState();
    const isBlurEvent =
      (prevActive.current !== undefined && active === undefined) ||
      (prevActive.current !== undefined && active !== undefined && prevActive.current !== active);

    const fieldsWithErrors = Object.keys(errors);
    const fieldsDirty = Object.keys(dirtyFields);
    const valid = intersection(fieldsWithErrors, fieldsDirty).length === 0;

    if (values.status === ProjectStatusEnum.Unpublished && active) {
      form.change('status', ProjectStatusEnum.Blank);
    }

    if (!valid || validating) {
      return;
    }

    if ((!valid || validating) && !dirtySinceLastSubmit) {
      return;
    }

    if ((isBlurEvent && dirty) || (dirtyFields.region && values.region === null)) {
      submitPromiseRef.current = onSubmit(values, form);
    }
  };

  const Step = steps[activeStepIndex].content;
  const decorators = useMemo(() => [focusOnErrors], []);

  return (
    <Form
      initialValues={initialValues}
      keepDirtyOnReinitialize={hasUnsavedChanges}
      validate={validator}
      decorators={decorators}
      onSubmit={submit}
      render={({
        form,
        handleSubmit,
        dirty,
        values,
        valid,
        dirtySinceLastSubmit,
        hasSubmitErrors,
      }): React.ReactNode => (
        <>
          <Banner regions={referenceData.regionList} title={values.name} regionId={values.region} />
          <VegaForm onSubmit={handleSubmit} className={cnProjectForm()} data-testid={testId.form}>
            <div className={cnProjectForm('Content')}>
              <NavigationList className={cnProjectForm('Navigation')} data-testid={testId.stepList}>
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
              onCreate={() => {
                form.change('status', ProjectStatusEnum.Unpublished);
              }}
              activeStep={activeStepIndex}
              stepsAmount={steps.length}
              isVisibleEdit={
                dirty || (!valid && !dirtySinceLastSubmit) || (hasSubmitErrors && dirty)
              }
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
                  autoSave(form);
                }
                prevActive.current = formState.active;
              }}
            />
          </VegaForm>
        </>
      )}
    />
  );
};
