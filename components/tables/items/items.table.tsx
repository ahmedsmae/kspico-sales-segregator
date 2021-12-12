import React, { Fragment, useState } from 'react';
import { Grid, Pagination, Select, Table } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { LineIds } from '../../../constants/strings';

const ROWS_PER_PAGE = 10;

interface ItemsTableProps {
  items: Array<IItem>;
  handleChange: (itemId: string, lineId: ILineId) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, handleChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderSelect: TableColumnRender<IItem> = (value, rowData) => {
    return (
      <Select
        value={value}
        placeholder='Choose one'
        onChange={value => handleChange(rowData.item_id, value as ILineId)}
      >
        {LineIds.map(lineId => (
          <Select.Option key={lineId} value={lineId}>
            {lineId.toUpperCase()}
          </Select.Option>
        ))}
      </Select>
    );
  };

  return (
    <Fragment>
      <Table<IItem>
        data={items.slice(
          (currentPage - 1) * ROWS_PER_PAGE,
          currentPage * ROWS_PER_PAGE
        )}
      >
        <Table.Column<IItem> prop='item_name' label='Item Name' />
        <Table.Column<IItem> prop='item_id' label='Item ID' />
        <Table.Column<IItem>
          prop='line_id'
          label='Line'
          render={renderSelect}
        />
      </Table>

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Pagination
            mt={1}
            mb={1}
            count={Math.ceil(items.length / ROWS_PER_PAGE)}
            page={currentPage}
            onChange={setCurrentPage}
            limit={15}
          />
        </Grid>
      </Grid.Container>
    </Fragment>
  );
};

export default ItemsTable;
