import { ProjectStatusEnum } from '../../../__generated__/types';

export type MenuItemProps = {
  close: VoidFunction;
  className?: string;
};

export type MenuItem = {
  key: string;
  Element: React.FC<MenuItemProps>;
};

export type DateEditedAt = {
  date: string;
  time: string;
};

export type TableRow = {
  id: string;
  isFavorite?: boolean;
  name?: string;
  region?: string;
  roles?: string;
  createdBy?: string;
  createdAt?: string;
  description?: string;
  editedAt?: DateEditedAt;
  menu?: MenuItem[];
  version?: number;
  status?: ProjectStatusEnum;
};
