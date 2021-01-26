/* istanbul ignore file */
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum, ProjectTypeEnum } from '../../../../../__generated__/types';
import { FormValues } from '../types';

export const initializeProjectForm = (fields?: FormValues): FormValues =>
  fields ?? {
    name: '',
    description: '',
    region: null,
    status: ProjectStatusEnum.Blank,
    coordinates: '',
    yearStart: undefined,
    type: ProjectTypeEnum.Geo,
  };

type ResultCombobox = {
  buttons(): NodeListOf<HTMLButtonElement>;
  input(): HTMLInputElement | null;
  options(): HTMLElement[];
  type(val: string): void;
  selectOption(opt: number): void;
  awaitAnimation(): void;
  toggle(): void;
  clear(): void;
};

export const getCombobox = (combobox: HTMLElement): ResultCombobox => {
  const buttons = () => combobox.querySelectorAll('button');
  const input = () => combobox.querySelector('input');
  const options = () => screen.queryAllByRole('option');
  const awaitAnimation = () => {
    act(() => {
      jest.runAllTimers();
    });
  };

  return {
    buttons,
    input,
    options,
    type: (val) => {
      const inpt = input();
      if (inpt) {
        userEvent.type(inpt, val);
      }
      awaitAnimation();
    },
    selectOption: (opt: number) => {
      const opts = options();
      userEvent.click(opts[opt]);
      awaitAnimation();
    },
    awaitAnimation,
    toggle: () => {
      const btns = buttons();
      if (btns.length === 2) {
        userEvent.click(btns[1]);
      } else {
        userEvent.click(btns[0]);
      }
      awaitAnimation();
    },
    clear: () => {
      const btns = buttons();
      if (btns.length === 2) {
        userEvent.click(btns[0]);
      }
      awaitAnimation();
    },
  };
};
