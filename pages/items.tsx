import { Button, Grid, Input, Page, Text } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ItemsTable from '../components/tables/items/items.table';
import { findAllItems } from '../utils/file-manipulators';

interface ItemsPageProps {
  initialItems: Array<IItem>;
}

const ItemsPage: NextPage<ItemsPageProps> = ({ initialItems }) => {
  const router = useRouter();

  const [items, setItems] = useState<Array<IItem>>(initialItems);

  const [searchQ, setSearchQ] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const matchingRecords = initialItems.filter(record =>
    record.item_name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = await fetch('/api/save-items', {
      method: 'POST',
      body: JSON.stringify({ items }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log({ data });
    router.replace('/');
  };

  return (
    <Page>
      <Text h1>All Items</Text>
      <Text p i>
        {"Here you can edit item's lines"}
      </Text>
      <Input
        icon={<Search />}
        mb={1}
        width='100%'
        clearable
        placeholder='filter by item names...'
        value={searchQ}
        onChange={e => setSearchQ(e.target.value)}
      />

      <ItemsTable
        items={matchingRecords}
        handleChange={(itemId, lineId) => {
          setItems(prev =>
            prev.map(r =>
              r.item_id === itemId ? { ...r, line_id: lineId } : r
            )
          );
          setIsUpdated(true);
        }}
      />

      <Grid.Container>
        <Grid xs />
        <Grid>
          <Button type='secondary' disabled={!isUpdated} onClick={handleSave}>
            Save Items
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<ItemsPageProps> =
  async context => {
    const initialItems = findAllItems();
    return { props: { initialItems } };
  };

export default ItemsPage;
