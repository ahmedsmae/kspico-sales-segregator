import type { NextApiRequest, NextApiResponse } from 'next';
import { saveToItems } from '../../utils/file-manipulators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  const items = req.body.items as Array<IItem>;

  try {
    saveToItems(items);
    res.json({
      status: 'success',
      message: 'Items saved successfully'
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
};

export default handler;
