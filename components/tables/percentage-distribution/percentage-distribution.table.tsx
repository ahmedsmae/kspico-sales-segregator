import React, { Fragment, useState } from 'react';
import { Grid, Input, Pagination, Table } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { AreaIds } from '../../../constants/strings';

const ROWS_PER_PAGE = 10;

interface PercentageDistributionTableProps {
  percentageDistributions: Array<IPercentageDistribution>;
  handleChange: (
    accountId: string,
    prop: keyof IPercentageDistribution
  ) => (value: string) => void;
}

const PercentageDistributionTable: React.FC<PercentageDistributionTableProps> =
  ({ percentageDistributions, handleChange }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const renderInput: (
      prop: keyof IPercentageDistribution
    ) => TableColumnRender<IPercentageDistribution> = (
      prop: keyof IPercentageDistribution
    ) =>
      function R(value, rowData) {
        const placeholder = prop
          .replace('_uae', '')
          .replace('_', '')
          .toUpperCase();

        return (
          <Input
            htmlType='number'
            placeholder={placeholder}
            value={value + ''}
            onChange={e =>
              handleChange(rowData.account_id, prop)(e.target.value)
            }
          />
        );
      };

    return (
      <Fragment>
        <Table<IPercentageDistribution>
          data={percentageDistributions.slice(
            (currentPage - 1) * ROWS_PER_PAGE,
            currentPage * ROWS_PER_PAGE
          )}
        >
          <Table.Column<IPercentageDistribution>
            prop='account_name'
            label='Account Name'
          />
          {AreaIds.map(areaId => (
            <Table.Column<IPercentageDistribution>
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
              count={Math.ceil(percentageDistributions.length / ROWS_PER_PAGE)}
              page={currentPage}
              onChange={setCurrentPage}
              limit={15}
            />
          </Grid>
        </Grid.Container>
      </Fragment>
    );
  };

export default PercentageDistributionTable;
