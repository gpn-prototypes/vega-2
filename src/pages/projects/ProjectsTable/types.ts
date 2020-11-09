import { ProjectStatusEnum } from '../../../__generated__/types';

export type MenuItemProps = {
  close: VoidFunction;
  className?: string;
};

export type MenuItem = {
  key: string;
  Element: React.FC<MenuItemProps>;
};

export type TableRow = {
  id: string;
  isFavorite?: boolean;
  name?: React.ReactElement;
  region?: string;
  roles?: string;
  createdBy?: string;
  createdAt?: string;
  editedAt?: string | React.ReactElement;
  menu?: MenuItem[];
  version?: number;
  status?: ProjectStatusEnum;
};
