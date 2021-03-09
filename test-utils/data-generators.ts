import faker from 'faker/locale/ru';
import { mergeLeft } from 'ramda';
import { v4 as uuidv4 } from 'uuid';

import {
  Attendee,
  Country,
  Project,
  ProjectRole,
  ProjectStatusEnum,
  ProjectTypeEnum,
  Region,
  User,
} from '../src/__generated__/types';

export function createID(): string {
  return uuidv4();
}

export function createUser(data: Partial<User> = {}): Partial<User> {
  return mergeLeft(data, {
    vid: createID(),
    name: faker.name.findName(),
    role: faker.name.jobTitle(),
  });
}

export function createProjectRole(data: Partial<ProjectRole> = {}): Partial<ProjectRole> {
  return mergeLeft(data, {
    vid: createID(),
    name: faker.name.findName(),
  });
}

export function createAttendee(data: Partial<Attendee> = {}): Partial<Attendee> {
  return mergeLeft(data, {
    user: createUser(),
    roles: [createProjectRole()],
  });
}

export function createProject(data?: Partial<Project>): Project {
  return mergeLeft(data ?? {}, {
    vid: createID(),
    name: faker.company.companyName(),
    type: ProjectTypeEnum.Geo,
    attendees: [createAttendee()],
    isFavorite: false,
    versions: [1],
    recentlyEdited: false,
    region: null,
    coordinates: null,
    description: null,
    version: 1,
    editedAt: faker.date.future(),
    createdAt: faker.date.past(),
    createdBy: createUser(),
    status: ProjectStatusEnum.Blank,
  });
}

export function createCountry(data: Partial<Country> = {}): Partial<Country> {
  return mergeLeft(data, {
    vid: createID(),
    name: 'Российская Федерация',
  });
}

export function createRegion(data: Partial<Region> = {}): Partial<Region> {
  return mergeLeft(data, {
    vid: createID(),
    name: 'Москва',
    fullName: 'Московская область',
  });
}
