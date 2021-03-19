import React from 'react';
import { merge } from 'ramda';

import { Country, Region } from '../../../../__generated__/types';
import { render, RenderResult } from '../../../../testing';

import { Banner, BannerProps, getDescription } from './Banner';

type CreateRegionProps = {
  region: {
    id: string;
    name: string;
    fullName?: string;
  };
  country?: {
    id: string;
    name: string;
  };
};

type CreateRegionResult = { __typename: 'Region' } & Pick<Region, 'vid' | 'name' | 'fullName'> & {
    country?: { __typename: 'Country' } & Pick<Country, 'vid' | 'name'>;
  };

export const createRegion = (props: CreateRegionProps): CreateRegionResult => {
  const { region } = props;
  return {
    __typename: 'Region',
    name: region.name,
    fullName: region.fullName,
    vid: region.id,
    country: props.country
      ? { __typename: 'Country', vid: props.country.id, name: props.country.name }
      : undefined,
  };
};

const defaultProps: BannerProps = {
  regions: [
    createRegion({
      region: {
        id: 'region-1',
        name: 'СССР',
      },
      country: { id: 'country-1', name: 'Москва' },
    }),
  ],
};

const renderComponent = (props?: Partial<BannerProps>): RenderResult => {
  const withDefaults = merge(defaultProps);
  const { regions, regionId, title } = props ? withDefaults(props) : defaultProps;

  return render(<Banner regions={regions} regionId={regionId} title={title} />);
};

describe('getDescription', () => {
  it('возвращает описание', () => {
    const region = createRegion({
      region: {
        id: 'region-1',
        name: 'СССР',
      },
      country: { id: 'country-1', name: 'Москва' },
    });

    const expected = getDescription('region-1', [region]);
    expect(expected).toEqual('Москва, СССР');
  });

  it('возвращает полное имя региона, если такое существует', () => {
    const region = createRegion({
      region: {
        id: 'region-1',
        name: 'СССР',
        fullName: 'Союз Советских Социалистических Республик',
      },
      country: { id: 'country-1', name: 'Москва' },
    });

    const expected = getDescription('region-1', [region]);
    expect(expected).toEqual('Москва, Союз Советских Социалистических Республик');
  });

  it('возвращает undefined, если список пустой', () => {
    const expected = getDescription('id', []);
    expect(expected).toEqual(undefined);
  });

  it('возвращает undefined, если нет региона или страны', () => {
    const desc1 = getDescription('region-1', [
      createRegion({
        region: {
          id: 'region-1',
          name: '',
          fullName: '',
        },
        country: { id: 'country-1', name: 'Москва' },
      }),
    ]);

    const desc2 = getDescription('region-1', [
      createRegion({
        region: {
          id: 'region-1',
          name: 'СССР',
          fullName: 'Союз Советских Социалистических Республик',
        },
        country: { id: 'country-1', name: '' },
      }),
    ]);

    expect(desc1).toEqual(undefined);
    expect(desc2).toEqual(undefined);
  });
});

describe('Banner', () => {
  it('рендерит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  it('отображает название', () => {
    const region = createRegion({
      region: {
        id: 'region-1',
        name: 'СССР',
        fullName: 'Союз Советских Социалистических Республик',
      },
      country: { id: 'country-1', name: 'Москва' },
    });

    const { getByTitle } = renderComponent({
      regions: [region],
      title: 'Мой первый проект',
      regionId: 'region-1',
    });

    const title = getByTitle('Мой первый проект');
    expect(title.textContent).toEqual('Мой первый проект');
  });

  it('отображает регион', () => {
    const region = createRegion({
      region: {
        id: 'region-1',
        name: 'СССР',
        fullName: 'Союз Советских Социалистических Республик',
      },
      country: { id: 'country-1', name: 'Москва' },
    });

    const { getByTitle } = renderComponent({
      regions: [region],
      title: 'Мой первый проект',
      regionId: 'region-1',
    });

    const description = getByTitle(/Москва/i);
    expect(description.textContent).toEqual('Москва, Союз Советских Социалистических Республик');
  });

  it('не отображает название и регион, если их нет', () => {
    const { container } = renderComponent({
      regions: [],
      title: '',
      regionId: 'region-1',
    });

    expect(container.textContent).toEqual('');
  });
});
