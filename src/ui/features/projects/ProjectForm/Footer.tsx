import React from 'react';
import { Button, IconBackward, IconForward, PageFooter } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from './cn-form';
import { FormMode } from './types';

export type FooterProps = {
  mode: FormMode;
  activeStep: number;
  stepsAmount: number;
  isFormDirty: boolean;
  onStepChange: (step: number) => void;
  onCancel: () => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { mode, activeStep, stepsAmount, isFormDirty, onStepChange, onCancel } = props;

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === stepsAmount - 1;

  const handleNextStep = (): void => {
    onStepChange(activeStep + 1);
  };

  const handlePrevStep = (): void => {
    onStepChange(activeStep - 1);
  };

  const createProjectFormFooter = (
    <PageFooter className={cnProjectForm('Footer', { content: 'space-between' })}>
      <Button size="s" view="ghost" label="Отмена" type="button" onClick={onCancel} />
      <div className={cnProjectForm('Footer-buttons-block')}>
        {!isFirstStep && (
          <Button
            size="s"
            view="ghost"
            label="Назад"
            iconLeft={IconBackward}
            type="button"
            className={cnProjectForm('Footer-button-back').toString()}
            onClick={handlePrevStep}
          />
        )}
        {!isLastStep && (
          <Button
            size="s"
            view="primary"
            label="Далее"
            iconRight={IconForward}
            type="button"
            onClick={handleNextStep}
          />
        )}
        {isLastStep && <Button size="s" view="primary" label="Создать проект" type="submit" />}
      </div>
    </PageFooter>
  );

  const editProjectFromFooter = (
    <PageFooter className={cnProjectForm('Footer', { content: 'end' })}>
      <Button size="s" view="primary" label="Сохранить изменения" type="submit" />
    </PageFooter>
  );

  return (
    <>
      {isCreateMode && createProjectFormFooter}
      {isEditMode && isFormDirty && editProjectFromFooter}
    </>
  );
};
