import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, RenderResult } from '@testing-library/react';
import { merge } from 'ramda';

import { Bus } from '../../../types/bus';
import { BusContext } from '../../providers/bus/Bus';

import {
  MockCreateBlankProject,
  MockProjectFormFields,
  MockProjectFormRegionList,
} from './__mocks__';
import { CreateProjectPage } from './CreateProjectPage';

// https://trojanowski.dev/apollo-hooks-testing-without-act-warnings/
async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

type RenderComponentResult = {
  component: RenderResult;
  bus: Bus;
};

type Props = {
  mocks: MockedResponse[];
};

const defaultProps = {
  mocks: [],
};

const renderComponent = (props?: Partial<Props>): RenderComponentResult => {
  const withDefaults = merge(defaultProps);
  const { mocks } = props ? withDefaults(props) : defaultProps;

  const bus = { send: jest.fn(), subscribe: () => jest.fn() } as Bus;

  const component = render(
    <BrowserRouter>
      <MockedProvider mocks={mocks}>
        <BusContext.Provider value={bus}>
          <CreateProjectPage />
        </BusContext.Provider>
      </MockedProvider>
    </BrowserRouter>,
  );

  return {
    component,
    bus,
  };
};

describe('CreateProjectPage', () => {
  it('создается проект', async () => {
    await renderComponent({
      mocks: [MockCreateBlankProject, MockProjectFormRegionList, MockProjectFormFields],
    });
    await wait();
  });
});
