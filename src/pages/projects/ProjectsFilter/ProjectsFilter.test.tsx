import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectFilterProps, ProjectsFilter } from './ProjectsFilter';

function renderComponent(props: ProjectFilterProps): RenderResult {
  const { onInputSearch, onChangeFilter } = props;
  return render(
    <>
      <ProjectsFilter onInputSearch={onInputSearch} onChangeFilter={onChangeFilter} />
    </>,
  );
}

describe('ProjectsFilter', () => {
  test('рендерится без ошибок', () => {
    const onInputSearch = jest.fn();
    const onChangeFilter = jest.fn();

    renderComponent({ onInputSearch, onChangeFilter });

    expect(screen.getByPlaceholderText('Введите название проекта или имя автора')).toBeVisible();
  });

  test('срабатывает onInputSearch', () => {
    const onInputSearch = jest.fn();
    const onChangeFilter = jest.fn();

    renderComponent({ onInputSearch, onChangeFilter });

    const input = screen.getByPlaceholderText('Введите название проекта или имя автора');

    userEvent.type(input, 'test');

    expect(onInputSearch).toBeCalled();
    expect(onInputSearch).toHaveBeenCalledWith('test');
  });

  test('срабатывает onChangeFilter', () => {
    const onInputSearch = jest.fn();
    const onChangeFilter = jest.fn();

    renderComponent({ onInputSearch, onChangeFilter });

    const input = screen.getByLabelText('Избранные');

    userEvent.click(input);

    expect(onChangeFilter).toBeCalled();
  });
});
