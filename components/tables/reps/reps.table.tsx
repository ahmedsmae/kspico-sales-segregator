import React, { Fragment, useState } from 'react';
import { Grid, Pagination, Select, Table } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { LineIds } from '../../../constants/strings';

const ROWS_PER_PAGE = 10;

interface RepsTableProps {
  reps: Array<IRep>;
  handleChange: (areaId: string, lineId: ILineId) => void;
}

const RepsTable: React.FC<RepsTableProps> = ({ reps, handleChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderSelect: TableColumnRender<IRep> = (value, rowData) => {
    return (
      <Select
        value={value}
        placeholder='Choose one'
        onChange={value => handleChange(rowData.area_id, value as ILineId)}
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
      <Table<IRep>
        data={reps.slice(
          (currentPage - 1) * ROWS_PER_PAGE,
          currentPage * ROWS_PER_PAGE
        )}
      >
        <Table.Column<IRep> prop='rep_name' label='Rep Name' />
        <Table.Column<IRep> prop='area_id' label='Area ID' />
        <Table.Column<IRep> prop='line_id' label='Line' render={renderSelect} />
      </Table>

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Pagination
            mt={1}
            mb={1}
            count={Math.ceil(reps.length / ROWS_PER_PAGE)}
            page={currentPage}
            onChange={setCurrentPage}
            limit={15}
          />
        </Grid>
      </Grid.Container>
    </Fragment>
  );
};

export default RepsTable;
