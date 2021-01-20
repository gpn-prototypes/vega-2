import React from 'react';
import { Form } from 'react-final-form';
import { act, render, RenderResult, screen } from '@testing-library/react';
import { createForm, FormApi } from 'final-form';
import { merge } from 'ramda';

import { referenceData as defaultReferenceData } from './__tests__/data';
import { initializeProjectForm } from './__tests__/utils';
import { Banner, BannerProps, getDescription } from './Banner';
import { FormValues } from './types';

type RenderComponentResult = {
  component: RenderResult;
  form: FormApi<FormValues>;
};

const defaultProps: BannerProps = {
  referenceData: defaultReferenceData,
};

const renderComponent = (props?: Partial<BannerProps>): RenderComponentResult => {
  const withDefaults = merge(defaultProps);
  const { referenceData } = props ? withDefaults(props) : defaultProps;

  const form = createForm<FormValues>({
    onSubmit: () => {},
    initialValues: initializeProjectForm(),
  });

  const component = render(
    <Form form={form} onSubmit={() => {}}>
      {() => {
        return <Banner referenceData={referenceData} />;
      }}
    </Form>,
  );

  return {
    form,
    component,
  };
};

describe('Banner', () => {
  describe('getDescription', () => {
    it('возвращает описание', () => {
      const { regionList } = defaultReferenceData;
      const expected = getDescription('345', regionList);
      expect(expected).toEqual('Российская, Россия');
    });

    it('возвращает полное имя региона, если такое существует', () => {
      const { regionList } = defaultReferenceData;
      const expected = getDescription('123', regionList);
      expect(expected).toEqual('Европейская, Европушка');
    });

    it('не возвращает описание, если не передать id', () => {
      const { regionList } = defaultReferenceData;
      const expected = getDescription(undefined, regionList);
      expect(expected).toEqual(undefined);
    });
  });

  it('ренденрит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  it('отображает название', () => {
    const { form } = renderComponent();
    act(() => {
      form.change('name', 'Мой первый');
    });
    const title = screen.getByTestId('ProjectForm:banner:title');
    expect(title.textContent).toEqual('Мой первый');
  });

  it('отображает регион', () => {
    const { form } = renderComponent();
    act(() => {
      form.change('name', 'Мой первый');
      form.change('region', '123');
    });

    const description = screen.getByTestId('ProjectForm:banner:description');
    expect(description.textContent).toEqual('Европейская, Европушка');
  });

  it('не отображает название и регион, если их нет', () => {
    const { form } = renderComponent();
    act(() => {
      form.change('name', '');
      form.change('region', '');
    });

    const title = screen.queryByTestId('ProjectForm:banner:title');
    const description = screen.queryByTestId('ProjectForm:banner:description');

    expect(title).not.toBeInTheDocument();
    expect(description).not.toBeInTheDocument();
  });
});
