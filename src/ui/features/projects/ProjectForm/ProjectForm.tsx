import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';
import { createForm } from 'final-form';
import createDecorator from 'final-form-focus';

import { createValidate, validators } from '../../../forms/validation';

import { Banner } from './Banner';
import { cnProjectForm } from './cn-form';
import { Footer } from './Footer';
import { DescriptionStep } from './steps';
import { FormProps, FormValues } from './types';

import './ProjectForm.css';

const focusOnErrors = createDecorator<FormValues>();

const currentYear = new Date().getFullYear();

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
    validators.min(
      currentYear - 1,
      () => 'Год начала планирования не может быть раньше предыдущего',
    ),
  ],
});

const steps = [{ title: 'Описание проекта', content: DescriptionStep }];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { mode, initialValues, referenceData, onSubmit, onCancel } = formProps;

  const form = React.useMemo(() => createForm({ onSubmit, initialValues, validate: validator }), [
    initialValues,
    onSubmit,
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const undecorate = React.useMemo(() => focusOnErrors(form), [form]);

  React.useEffect(() => () => undecorate(), [undecorate]);

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
      form={form}
      onSubmit={onSubmit}
      render={({ handleSubmit, dirty }): React.ReactNode => (
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
              <Step mode={mode} referenceData={referenceData} form={form} />
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
