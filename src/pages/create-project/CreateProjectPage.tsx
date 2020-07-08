import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import {
  Button,
  Form as VegaForm,
  IconForward,
  NavigationList,
  PageBanner,
  PageFooter,
  TextField,
} from '@gpn-prototypes/vega-ui';

import { cnCreateProjectPage } from './cn-create-project-page';

import './CreateProjectPage.css';

type FormProps = {
  name: string;
  region: string;
  type: string;
  coordinates: string;
  description: string;
};

type PageProps = {};

export const CreateProjectPage: React.FC<PageProps> = () => {
  const [activePageIndex, setActivePageIndex] = useState(0);

  const pages = [
    {
      title: 'Описание проекта',
      fields: (
        <>
          <VegaForm.Row>
            <VegaForm.Field>
              <VegaForm.Label htmlFor="name" space="2xs">
                Название проекта
              </VegaForm.Label>
              <Field
                name="name"
                render={({ input }): React.ReactNode => (
                  <>
                    <TextField
                      id="name"
                      size="s"
                      width="full"
                      placeholder="Придумайте название проекта"
                      name={input.name}
                      value={input.value}
                      /* onChange из TextField возвращает не стандартный формат: e, id, name, value  */
                      onChange={({ e }): void => input.onChange(e)}
                      /*
                        TextField ожидает функцию (event: React.FocusEvent<Element>) => void
                        input.onBlur имеет формат (event?: React.FocusEvent<HTMLElement> | undefined) => void
                        как итог, ошибка: Type 'FocusEvent<Element>' is not assignable to type 'FocusEvent<HTMLElement>'
                      */
                      onBlur={input.onBlur as React.FocusEventHandler}
                      onFocus={input.onFocus as React.FocusEventHandler}
                    />
                  </>
                )}
              />
            </VegaForm.Field>
          </VegaForm.Row>
          <VegaForm.Row space="m">
            <VegaForm.Field>
              <VegaForm.Label htmlFor="region" space="2xs">
                Регион
              </VegaForm.Label>
              <Field
                name="region"
                render={({ input }): React.ReactNode => (
                  <TextField
                    id="region"
                    size="s"
                    width="full"
                    placeholder="Выберите регион"
                    name={input.name}
                    value={input.value}
                    onChange={({ e }): void => input.onChange(e)}
                    onBlur={input.onBlur as React.FocusEventHandler}
                    onFocus={input.onFocus as React.FocusEventHandler}
                  />
                )}
              />
            </VegaForm.Field>
          </VegaForm.Row>
          <VegaForm.Row space="m">
            <VegaForm.Field>
              <VegaForm.Label htmlFor="type" space="2xs">
                Тип проекта
              </VegaForm.Label>
              <Field
                name="type"
                render={({ input }): React.ReactNode => (
                  <TextField
                    id="type"
                    size="s"
                    width="full"
                    placeholder="Выберите тип проекта"
                    name={input.name}
                    value={input.value}
                    onChange={({ e }): void => input.onChange(e)}
                    onBlur={input.onBlur as React.FocusEventHandler}
                    onFocus={input.onFocus as React.FocusEventHandler}
                  />
                )}
              />
            </VegaForm.Field>
          </VegaForm.Row>
          <VegaForm.Row space="m">
            <VegaForm.Field>
              <VegaForm.Label htmlFor="coordinates" space="2xs">
                Координаты
              </VegaForm.Label>
              <Field
                name="coordinates"
                render={({ input }): React.ReactNode => (
                  <TextField
                    id="coordinates"
                    size="s"
                    width="full"
                    placeholder="Укажите значения и систему координат"
                    name={input.name}
                    value={input.value}
                    onChange={({ e }): void => input.onChange(e)}
                    onBlur={input.onBlur as React.FocusEventHandler}
                    onFocus={input.onFocus as React.FocusEventHandler}
                  />
                )}
              />
            </VegaForm.Field>
          </VegaForm.Row>
          <VegaForm.Row space="m">
            <VegaForm.Field>
              <VegaForm.Label htmlFor="description" space="2xs">
                Описание проекта
              </VegaForm.Label>
              <Field
                name="description"
                render={({ input }): React.ReactNode => (
                  <TextField
                    id="description"
                    type="textarea"
                    minRows={3}
                    size="s"
                    width="full"
                    placeholder="Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие"
                    name={input.name}
                    value={input.value}
                    onChange={({ e }): void => input.onChange(e)}
                    onBlur={input.onBlur as React.FocusEventHandler}
                    onFocus={input.onFocus as React.FocusEventHandler}
                  />
                )}
              />
            </VegaForm.Field>
          </VegaForm.Row>
        </>
      ),
    },
    {
      title: 'Участники',
      fields: (
        <>
          <div className={cnCreateProjectPage('Stub')}>Форма: Участники</div>
        </>
      ),
    },
    {
      title: 'Связанные документы и файлы',
      fields: (
        <>
          <div className={cnCreateProjectPage('Stub')}>Форма: Связанные документы и файлы</div>
        </>
      ),
    },
  ];

  const onSubmit = (values: Partial<FormProps>): void => {
    console.log(values);
  };

  return (
    <div className={cnCreateProjectPage()}>
      <PageBanner title="Усть-Енисей" description="Россия, Ямало-Ненецкий АО, Усть-Енисей" />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }): React.ReactNode => (
          <VegaForm onSubmit={handleSubmit} className={cnCreateProjectPage('Form')}>
            <div className={cnCreateProjectPage('Content')}>
              <NavigationList className={cnCreateProjectPage('NavigationList')} ordered>
                {pages.map(({ title }, index) => (
                  <NavigationList.Item key={title} active={index === activePageIndex}>
                    {(props): React.ReactNode => (
                      <button
                        type="button"
                        onClick={(): void => setActivePageIndex(index)}
                        {...props}
                      >
                        {title}
                      </button>
                    )}
                  </NavigationList.Item>
                ))}
              </NavigationList>
              <div className={cnCreateProjectPage('Fields')}>{pages[activePageIndex].fields}</div>
            </div>
            <PageFooter className={cnCreateProjectPage('Footer')}>
              <Button size="s" view="ghost" label="Отмена" />
              <Button size="s" view="primary" label="Далее" iconRight={IconForward} />
            </PageFooter>
          </VegaForm>
        )}
      />
    </div>
  );
};
