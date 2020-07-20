import React, { useState } from 'react';
import { Form } from 'react-final-form';
import {
  Button,
  Form as VegaForm,
  IconForward,
  NavigationList,
  PageFooter,
} from '@gpn-prototypes/vega-ui';

import { cnForm } from './cn-form';
import { Step1, Step2, Step3 } from './steps';

import './ProjectForm.css';

type FormProps = {};

type FormValues = {
  name: string;
  region: string;
  type: string;
  coordinates: string;
  description: string;
};

const steps = [
  { title: 'Описание проекта', content: Step1 },
  { title: 'Участники', content: Step2 },
  { title: 'Связанные документы и файлы', content: Step3 },
];

export const ProjectForm: React.FC<FormProps> = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const onSubmit = (values: Partial<FormValues>): void => {
    console.log(values);
  };

  const Step = steps[activeStepIndex].content;

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }): React.ReactNode => (
        <VegaForm onSubmit={handleSubmit} className={cnForm()}>
          <div className={cnForm('Content')}>
            <NavigationList className={cnForm('NavigationList')} ordered>
              {steps.map(({ title }, index) => (
                <NavigationList.Item key={title} active={index === activeStepIndex}>
                  {(props): React.ReactNode => (
                    <button
                      type="button"
                      onClick={(): void => setActiveStepIndex(index)}
                      {...props}
                    >
                      {title}
                    </button>
                  )}
                </NavigationList.Item>
              ))}
            </NavigationList>
            <div className={cnForm('Fields')}>
              <Step />
            </div>
          </div>
          <PageFooter className={cnForm('Footer')}>
            <Button size="s" view="ghost" label="Отмена" />
            <Button size="s" view="primary" label="Далее" iconRight={IconForward} />
          </PageFooter>
        </VegaForm>
      )}
    />
  );
};
