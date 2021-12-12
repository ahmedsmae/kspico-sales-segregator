import { Page, Text } from '@geist-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { AreaIds } from '../../../constants/strings';
import {
  extractRawSalesFromFile,
  findAllPercentageDistribution,
  findAllFileDirectOrders,
  findAllItems,
  findAllReps
} from '../../../utils/file-manipulators';
import { getBlankAreaValues } from '../../../utils/get-blank-area-values';
import { getTotalQuantity } from '../../../utils/get-total-quantity';

import SegregatedItemsTable from '../../../components/tables/segregated-items/segregated-items.table';

interface SegregationPageProps {
  segregatedItems: Array<ISegregatedItem>;
}

const SegregationPage: NextPage<SegregationPageProps> = ({
  segregatedItems
}) => {
  const router = useRouter();
  const monthName = (router.query.filename as string).replace('.xlsx', '');

  return (
    <Page>
      <Text h1>Segregated Items</Text>
      <Text p i>
        Here is the final segregation of the items for the month of
        <Text span b>
          {` "${monthName}"`}
        </Text>
      </Text>
      <SegregatedItemsTable segregatedItems={segregatedItems} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<SegregationPageProps> =
  async context => {
    const filename = context.query.filename as string;

    const rawSales = extractRawSalesFromFile(filename);
    const accountPercentages = findAllPercentageDistribution();
    const items = findAllItems();
    const reps = findAllReps();
    const directOrders = findAllFileDirectOrders(filename);

    const segregatedItems: Array<ISegregatedItem> = [];

    for (const rawSale of rawSales) {
      let segregatedItemIndex = segregatedItems.findIndex(
        si => si.item_id === rawSale.item_id
      );

      if (segregatedItemIndex === -1) {
        // item does not exists
        // 1. add to list
        segregatedItems.push({
          item_id: rawSale.item_id,
          item_name: rawSale.item_name,
          quantity: rawSale.quantity,
          ...getBlankAreaValues()
        });

        // 2. update index to correct index
        segregatedItemIndex = segregatedItems.length - 1;
      } else {
        // item already exists

        // 1. increment quantity
        segregatedItems[segregatedItemIndex].quantity += rawSale.quantity;

        // 2. find the account percentage distribution
        const percentageDistribution = accountPercentages.find(
          ap => ap.account_id === rawSale.account_id
        );

        if (!percentageDistribution) continue;

        // 3. find if there is direct orders for that account and item
        const directOrderIndex = directOrders.findIndex(
          dOrder =>
            dOrder.account_id === rawSale.account_id &&
            dOrder.item_id === rawSale.item_id
        );

        // 4. find and concatenate direct orders and rest of order quantity
        for (const areaId of AreaIds) {
          // check if itemId related to this areaId
          const item = items.find(i => i.item_id === rawSale.item_id);
          if (!item) {
            console.error('item not found!');
            continue;
          }

          const rep = reps.find(r => r.area_id === areaId);
          if (!rep) {
            console.error('rep not found!');
            continue;
          }

          if (rep.line_id !== item.line_id) continue;

          let quantityToAdd = 0;
          let rawSaleQuantity = rawSale.quantity;

          if (directOrderIndex >= 0) {
            const directOrder = directOrders[directOrderIndex];

            if (directOrder[areaId] && directOrder[areaId] > 0) {
              quantityToAdd += directOrder[areaId];
            }

            const allDirectOrderQuantities = getTotalQuantity(directOrder);

            rawSaleQuantity = rawSale.quantity - allDirectOrderQuantities;
          }

          quantityToAdd =
            (rawSaleQuantity * percentageDistribution[areaId]) / 100;

          segregatedItems[segregatedItemIndex][areaId] += quantityToAdd;
        }
      }
    }

    return {
      props: {
        segregatedItems: segregatedItems.sort((iA, iB) => {
          if (iA.item_name > iB.item_name) return 1;
          if (iA.item_name < iB.item_name) return -1;
          return 0;
        })
      }
    };
  };

export default SegregationPage;
