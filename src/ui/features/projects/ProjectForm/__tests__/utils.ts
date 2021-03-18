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
  input(): HTMLInputElement;
  options(): Promise<HTMLElement[]>;
  type(val: string): void;
  selectOption(opt: number): void;
  awaitAnimation(): void;
  toggle(): void;
  clear(): void;
};

const ANIMATION_DURATION = 300;

export const getCombobox = (combobox: HTMLElement): ResultCombobox => {
  const buttons = () => combobox.querySelectorAll('button');
  const input = () => {
    const element = combobox.querySelector('input');
    if (!element) {
      throw new Error('combobox input not found');
    }

    return element;
  };

  const options = async () => screen.findAllByRole('option');
  const awaitAnimation = () => {
    act(() => {
      jest.advanceTimersByTime(ANIMATION_DURATION);
    });
  };

  return {
    buttons,
    input,
    options,
    awaitAnimation,
    type: (val) => {
      const inpt = input();
      if (inpt) {
        userEvent.type(inpt, val);
      }
      awaitAnimation();
    },
    selectOption: async (opt: number) => {
      const opts = await options();

      awaitAnimation();

      userEvent.click(opts[opt]);

      awaitAnimation();
    },

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
    },
  };
};
