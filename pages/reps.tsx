import { Button, Grid, Input, Page, Text } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RepsTable from '../components/tables/reps/reps.table';
import { findAllReps } from '../utils/file-manipulators';

interface RepsPageProps {
  initialReps: Array<IRep>;
}

const RepsPage: NextPage<RepsPageProps> = ({ initialReps }) => {
  const router = useRouter();

  const [reps, setReps] = useState<Array<IRep>>(initialReps);

  const [searchQ, setSearchQ] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const matchingRecords = initialReps.filter(record =>
    record.rep_name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = await fetch('/api/save-reps', {
      method: 'POST',
      body: JSON.stringify({ reps }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log({ data });
    router.replace('/');
  };

  return (
    <Page>
      <Text h1>All Reps</Text>
      <Text p i>
        {"Here you can edit rep's lines"}
      </Text>
      <Input
        icon={<Search />}
        mb={1}
        width='100%'
        clearable
        placeholder='filter by rep names...'
        value={searchQ}
        onChange={e => setSearchQ(e.target.value)}
      />

      <RepsTable
        reps={matchingRecords}
        handleChange={(areaId, lineId) => {
          setReps(prev =>
            prev.map(r =>
              r.area_id === areaId ? { ...r, line_id: lineId } : r
            )
          );
          setIsUpdated(true);
        }}
      />

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Button type='secondary' disabled={!isUpdated} onClick={handleSave}>
            Save Reps
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<RepsPageProps> =
  async context => {
    const initialReps = findAllReps();
    return { props: { initialReps } };
  };

export default RepsPage;
