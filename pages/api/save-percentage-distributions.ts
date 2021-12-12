import type { NextApiRequest, NextApiResponse } from 'next';
import { saveToPercentageDistribution } from '../../utils/file-manipulators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  const percentageDistributions = req.body
    .percentageDistributions as Array<IPercentageDistribution>;

  try {
    saveToPercentageDistribution(percentageDistributions);
    res.json({
      status: 'success',
      message: 'Percentage distributions saved successfully'
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
};

export default handler;
