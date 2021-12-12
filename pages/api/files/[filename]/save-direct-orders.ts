import type { NextApiRequest, NextApiResponse } from 'next';
import { saveDirectOrders } from '../../../../utils/file-manipulators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  const xlsxFilename = req.query.filename as string;
  const directOrders = req.body.directOrders as Array<IDirectOrder>;

  try {
    saveDirectOrders(xlsxFilename, directOrders);
    res.json({ status: 'success', message: 'File saved' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
};

export default handler;
