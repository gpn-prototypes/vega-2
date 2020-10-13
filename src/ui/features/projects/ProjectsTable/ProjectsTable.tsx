import React from 'react';
import { Table } from '@gpn-prototypes/vega-ui';

type TableElement = {
  id: string;
  isFavorite: boolean;
  region: string;
  role: string;
  createdBy: string;
  createdAt: string;
  editedAt: string;
};

type Props = {
  data: TableElement[];
  onFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const COLUMNS = [
  {
    title: 'Иконка',
    accessor: 'isFavorite',
  },
  {
    title: 'Регион',
    accessor: 'region',
  },
  {
    title: 'Ваша роль',
    accessor: 'role',
  },
  {
    title: 'Автор',
    accessor: 'createdBy',
  },
  {
    title: 'Создан',
    accessor: 'createdAt',
  },
  {
    title: 'Изменён',
    accessor: 'editedAt',
  },
];

export const ProjectsTable: React.FC<Props> = (props) => {
  return (
    <div>
      <Table columns={COLUMNS} rows={[]} />
    </div>
  );
};
