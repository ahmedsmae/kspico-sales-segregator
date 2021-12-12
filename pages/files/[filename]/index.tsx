import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Grid, Input, Page, Text } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import {
  extractRawSalesFromFile,
  findAllPercentageDistribution
} from '../../../utils/file-manipulators';

import PercentageDistributionTable from '../../../components/tables/percentage-distribution/percentage-distribution.table';
import { getTotalQuantity } from '../../../utils/get-total-quantity';
import { getBlankAreaValues } from '../../../utils/get-blank-area-values';

interface UnlistedAccountsPageProps {
  initialUnlistedAccounts: Array<IPercentageDistribution>;
}

const UnlistedAccountsPage: NextPage<UnlistedAccountsPageProps> = ({
  initialUnlistedAccounts
}) => {
  const router = useRouter();
  const salesFileName = router.query.filename;

  const [unlistedAccounts, setUnlistedAccounts] = useState<
    Array<IPercentageDistribution>
  >(initialUnlistedAccounts);

  const [searchQ, setSearchQ] = useState('');

  const handleSaveAndNext = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const newAccounts = unlistedAccounts.filter(
      acc => getTotalQuantity(acc) > 0
    );

    const response = await fetch('/api/save-new-accounts', {
      method: 'POST',
      body: JSON.stringify({ newAccounts }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log({ data });
    router.replace(`/files/${salesFileName}/direct-orders`);
  };

  const filteredAccount = unlistedAccounts.filter(account =>
    account.account_name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <Page>
      <Text h1>Unlisted Accounts</Text>
      <Text p i>
        Assign the following accounts by adding percentage to each med. rep.
      </Text>
      <Input
        icon={<Search />}
        mb={1}
        width='100%'
        clearable
        placeholder='filter by account names...'
        value={searchQ}
        onChange={e => setSearchQ(e.target.value)}
      />
      <PercentageDistributionTable
        percentageDistributions={filteredAccount}
        handleChange={(accountId, prop) => value =>
          setUnlistedAccounts(prev =>
            prev.map(acc =>
              acc.account_id === accountId ? { ...acc, [prop]: +value } : acc
            )
          )}
      />
      <Grid.Container>
        <Grid xs />
        <Grid>
          <Button type='secondary' onClick={handleSaveAndNext}>
            Save & Next
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<UnlistedAccountsPageProps> =
  async context => {
    const filename = context.query.filename as string;

    const rawSales = extractRawSalesFromFile(filename);

    const accountsPercentageList = findAllPercentageDistribution();

    // get new accounts
    let uniqueRawSalesAccountIds = [
      ...new Set(rawSales.map(sale => sale.account_id))
    ];

    const accountPercentageListAccountIds = accountsPercentageList.map(
      acc => acc.account_id
    );

    const unlistedAccounts: Array<IPercentageDistribution> = [];

    for (const rawSaleAccountId of uniqueRawSalesAccountIds) {
      if (!accountPercentageListAccountIds.includes(rawSaleAccountId)) {
        const rawSaleAccount = rawSales.find(
          saleRow => saleRow.account_id === rawSaleAccountId
        );

        if (rawSaleAccount && rawSaleAccount.account_id) {
          unlistedAccounts.push({
            account_id: rawSaleAccount.account_id,
            account_name: rawSaleAccount.account_name,
            ...getBlankAreaValues()
          });
        }
      }
    }

    return {
      props: { initialUnlistedAccounts: unlistedAccounts },
      redirect: unlistedAccounts.length === 0 && {
        destination: `/files/${filename}/direct-orders`
      }
    };
  };

export default UnlistedAccountsPage;
