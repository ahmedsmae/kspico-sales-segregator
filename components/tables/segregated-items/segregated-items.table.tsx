import React from 'react';
import { Table } from '@geist-ui/react';
import { AreaIds } from '../../../constants/strings';

interface SegregatedItemsTableProps {
  segregatedItems: Array<ISegregatedItem>;
}

const SegregatedItemsTable: React.FC<SegregatedItemsTableProps> = ({
  segregatedItems
}) => {
  return (
    <Table<ISegregatedItem> data={segregatedItems}>
      <Table.Column<ISegregatedItem> prop='item_name' label='Item Name' />
      <Table.Column<ISegregatedItem> prop='quantity' label='Total Quantity' />
      {AreaIds.map(areaId => (
        <Table.Column<ISegregatedItem>
          key={areaId}
          prop={areaId}
          label={areaId.replace('-', ' ').toUpperCase()}
        />
      ))}
    </Table>
  );
};

export default SegregatedItemsTable;
