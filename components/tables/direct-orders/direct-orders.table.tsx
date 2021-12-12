import React, { Fragment, useState } from 'react';
import { Grid, Input, Pagination, Table } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { AreaIds } from '../../../constants/strings';

const ROWS_PER_PAGE = 10;

interface DirectOrdersTableProps {
  directOrders: Array<IDirectOrder>;
  handleChange: (
    accountId: string,
    itemId: string,
    prop: keyof IDirectOrder
  ) => (value: string) => void;
}

const DirectOrdersTable: React.FC<DirectOrdersTableProps> = ({
  directOrders,
  handleChange
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderInput: (
    prop: keyof IDirectOrder
  ) => TableColumnRender<IDirectOrder> = (prop: keyof IDirectOrder) =>
    function R(value, rowData) {
      const placeholder = prop
        .replace('_uae', '')
        .replace('_', '')
        .toUpperCase();

      return (
        <Input
          htmlType='number'
          placeholder={placeholder}
          value={value ? value + '' : ''}
          onChange={e =>
            handleChange(
              rowData.account_id,
              rowData.item_id,
              prop
            )(e.target.value)
          }
        />
      );
    };

  return (
    <Fragment>
      <Table<IDirectOrder>
        data={directOrders.slice(
          (currentPage - 1) * ROWS_PER_PAGE,
          currentPage * ROWS_PER_PAGE
        )}
      >
        <Table.Column<IDirectOrder> prop='account_name' label='Account Name' />
        <Table.Column<IDirectOrder> prop='item_name' label='Item Name' />
        {AreaIds.map(areaId => (
          <Table.Column<IDirectOrder>
            key={areaId}
            prop={areaId}
            label={areaId.replace('-', ' ').toUpperCase()}
            render={renderInput(areaId)}
          />
        ))}
      </Table>

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Pagination
            mt={1}
            mb={1}
            count={Math.ceil(directOrders.length / ROWS_PER_PAGE)}
            page={currentPage}
            onChange={setCurrentPage}
            limit={15}
          />
        </Grid>
      </Grid.Container>
    </Fragment>
  );
};

export default DirectOrdersTable;
