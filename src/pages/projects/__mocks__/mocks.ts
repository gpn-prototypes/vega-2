import { defaultMock } from './mock-default';
import { deleteProjectMock } from './mock-delete-project';
import { favoriteProjectMock } from './mock-favorite-project';
import { favoriteProjectErrorMock } from './mock-favorite-project-error';

export const mocks = {
  default: defaultMock,
  deleteProject: deleteProjectMock,
  favoriteProject: favoriteProjectMock,
  favoriteErrorProject: favoriteProjectErrorMock,
};
