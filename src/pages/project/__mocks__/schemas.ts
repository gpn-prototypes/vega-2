import { mergeDeepLeft } from 'ramda';
import { v4 as uuidv4 } from 'uuid';

import {
  Country,
  Project,
  ProjectStatusEnum,
  ProjectTypeEnum,
  Region,
} from '../../../__generated__/types';

export function createID(): string {
  return uuidv4();
}
export function createProject(data: Partial<Project> = {}): Partial<Project> {
  return mergeDeepLeft(data, {
    vid: createID(),
    name: 'Проект',
    type: ProjectTypeEnum.Geo,
    region: null,
    coordinates: null,
    description: null,
    yearStart: 2022,
    version: 1,
    status: ProjectStatusEnum.Blank,
  });
}
export function createCountry(data: Partial<Country> = {}): Partial<Country> {
  return mergeDeepLeft(data, {
    vid: createID(),
    name: 'Российская Федерация',
  });
}

export function createRegion(data: Partial<Region> = {}): Partial<Region> {
  return mergeDeepLeft(data, {
    vid: createID(),
    name: 'Москва',
    fullName: 'Московская область',
  });
}
