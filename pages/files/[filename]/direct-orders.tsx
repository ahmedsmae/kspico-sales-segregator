import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Grid, Input, Page, Text } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';

import {
  extractRawSalesFromFile,
  findAllFileDirectOrders,
  isDirectOrdersFileExists
} from '../../../utils/file-manipulators';

import DirectOrdersTable from '../../../components/tables/direct-orders/direct-orders.table';
import { getTotalQuantity } from '../../../utils/get-total-quantity';
import { getBlankAreaValues } from '../../../utils/get-blank-area-values';

interface DirectOrdersPageProps {
  initialDirectOrders: Array<IDirectOrder>;
}

const DirectOrdersPage: NextPage<DirectOrdersPageProps> = ({
  initialDirectOrders
}) => {
  const router = useRouter();
  const xlsxFilename = router.query.filename;

  const [directOrders, setDirectOrders] =
    useState<Array<IDirectOrder>>(initialDirectOrders);

  const [searchAccountQ, setSearchAccountQ] = useState('');
  const [searchItemQ, setSearchItemQ] = useState('');

  const handleSaveAndNext = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const finalDirectOrders = directOrders.filter(
      acc => getTotalQuantity(acc) > 0
    );

    const response = await fetch(
      `/api/files/${xlsxFilename}/save-direct-orders`,
      {
        method: 'POST',
        body: JSON.stringify({ directOrders: finalDirectOrders }),
        headers: { 'Content-Type': 'application/json' }
      }
    );
    const data = await response.json();
    console.log({ data });
    router.replace(`/files/${xlsxFilename}/segregation`);
  };

  const filteredSales = directOrders.filter(
    sale =>
      sale.account_name.toLowerCase().includes(searchAccountQ.toLowerCase()) &&
      sale.item_name.toLowerCase().includes(searchItemQ.toLowerCase())
  );

  return (
    <Page>
      <Text h1>Direct Orders</Text>
      <Text p i>
        Here you can fill any direct orders to specific med. rep.
      </Text>
      <Grid.Container gap={1}>
        <Grid xs>
          <Input
            icon={<Search />}
            mb={1}
            width='100%'
            clearable
            placeholder='filter by account name...'
            value={searchAccountQ}
            onChange={e => setSearchAccountQ(e.target.value)}
          />
        </Grid>
        <Grid xs>
          <Input
            icon={<Search />}
            mb={1}
            width='100%'
            clearable
            placeholder='filter by item name...'
            value={searchItemQ}
            onChange={e => setSearchItemQ(e.target.value)}
          />
        </Grid>
      </Grid.Container>

      <DirectOrdersTable
        directOrders={filteredSales}
        handleChange={(accountId, itemId, prop) => value =>
          setDirectOrders(prev =>
            prev.map(sale =>
              sale.account_id === accountId && sale.item_id === itemId
                ? { ...sale, [prop]: +value }
                : sale
            )
          )}
      />

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Button type='secondary' onClick={handleSaveAndNext}>
            Save Orders & Show Segregation
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<DirectOrdersPageProps> =
  async context => {
    const filename = context.query.filename as string;

    const rawSales = extractRawSalesFromFile(filename);

    const initialDirectOrders: Array<IDirectOrder> = rawSales.map(sale => ({
      account_id: sale.account_id,
      account_name: sale.account_name,
      item_id: sale.item_id,
      item_name: sale.item_name,
      ...getBlankAreaValues()
    }));

    const directOrdersFileExists = isDirectOrdersFileExists(filename);

    if (!directOrdersFileExists) {
      return { props: { initialDirectOrders } };
    }

    const directOrders = findAllFileDirectOrders(filename);

    const finalRawSalesWithDirectOrders: Array<IDirectOrder> = [];

    for (const row of initialDirectOrders) {
      const directOrder = directOrders.find(
        dOrder =>
          dOrder.account_id === row.account_id && dOrder.item_id === row.item_id
      );

      if (directOrder) {
        finalRawSalesWithDirectOrders.push(directOrder);
      } else {
        finalRawSalesWithDirectOrders.push(row);
      }
    }

    return { props: { initialDirectOrders: finalRawSalesWithDirectOrders } };
  };

export default DirectOrdersPage;
