import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';
import createDecorator from 'final-form-focus';

import { createValidate, validators } from '../../../forms/validation';

import { Banner } from './Banner';
import { cnProjectForm } from './cn-form';
import { Footer } from './Footer';
import { DescriptionStep } from './steps';
import { FormProps, FormValues } from './types';

import './ProjectForm.css';

const focusOnErrors = createDecorator();

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
});

const steps = [{ title: 'Описание проекта', content: DescriptionStep }];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { mode, initialValues, referenceData, onSubmit, onCancel } = formProps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const handleFormSubmit = (values: FormValues): void => {
    onSubmit(values);
  };

  const handleStepChange = (step: number) => {
    setActiveStepIndex(step);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const Step = steps[activeStepIndex].content;

  return (
    <Form
      keepDirtyOnReinitialize
      initialValues={initialValues}
      validate={validator}
      decorators={[focusOnErrors]}
      onSubmit={handleFormSubmit}
      render={({ handleSubmit, dirty, form }): React.ReactNode => (
        <>
          <Banner referenceData={referenceData} />
          <VegaForm onSubmit={handleSubmit} className={cnProjectForm()}>
            <div className={cnProjectForm('Content')}>
              <NavigationList className={cnProjectForm('Navigation')}>
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
              <Step mode={mode} referenceData={referenceData} />
            </div>
            <Footer
              mode={mode}
              isFormDirty={dirty}
              activeStep={activeStepIndex}
              stepsAmount={steps.length}
              onStepChange={handleStepChange}
              onCancel={() => {
                if (mode === 'create') {
                  handleCancel();
                } else {
                  form.reset();
                }
              }}
            />
          </VegaForm>
        </>
      )}
    />
  );
};
