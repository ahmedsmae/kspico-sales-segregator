import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findAllPercentageDistribution,
  saveToPercentageDistribution
} from '../../utils/file-manipulators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  const newAccounts = req.body.newAccounts as Array<IPercentageDistribution>;

  try {
    const accountsPercentageList = findAllPercentageDistribution();
    const mergedAccounts = accountsPercentageList.concat(newAccounts);
    saveToPercentageDistribution(mergedAccounts);
    res.json({
      status: 'success',
      message: 'Accounts percentages saved successfully'
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
};

export default handler;
