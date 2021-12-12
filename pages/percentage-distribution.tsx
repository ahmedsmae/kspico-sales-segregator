import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Grid, Input, Page, Text } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import { findAllPercentageDistribution } from '../utils/file-manipulators';

import PercentageDistributionTable from '../components/tables/percentage-distribution/percentage-distribution.table';

interface PercentageDistributionPageProps {
  initialPercentageDistributions: Array<IPercentageDistribution>;
}

const PercentageDistributionPage: NextPage<PercentageDistributionPageProps> = ({
  initialPercentageDistributions
}) => {
  const router = useRouter();

  const [percentageDistributions, setPercentageDistributions] = useState<
    Array<IPercentageDistribution>
  >(initialPercentageDistributions);

  const [searchQ, setSearchQ] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const matchingRecords = percentageDistributions.filter(record =>
    record.account_name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = await fetch('/api/save-percentage-distributions', {
      method: 'POST',
      body: JSON.stringify({ percentageDistributions }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log({ data });
    router.replace('/');
  };

  return (
    <Page>
      <Text h1>Percentage Distribution</Text>
      <Text p i>
        Here is how all the accounts get distributed to each med. rep.
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
        percentageDistributions={matchingRecords}
        handleChange={(accountId, prop) => value => {
          setPercentageDistributions(prev =>
            prev.map(acc =>
              acc.account_id === accountId ? { ...acc, [prop]: +value } : acc
            )
          );
          setIsUpdated(true);
        }}
      />
      <Grid.Container>
        <Grid xs />
        <Grid>
          <Button type='secondary' disabled={!isUpdated} onClick={handleSave}>
            Save Distributions
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<PercentageDistributionPageProps> =
  async context => {
    const initialPercentageDistributions = findAllPercentageDistribution();
    return { props: { initialPercentageDistributions } };
  };

export default PercentageDistributionPage;
