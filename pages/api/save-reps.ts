import type { NextApiRequest, NextApiResponse } from 'next';
import { saveToReps } from '../../utils/file-manipulators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  const reps = req.body.reps as Array<IRep>;

  try {
    saveToReps(reps);
    res.json({
      status: 'success',
      message: 'Reps saved successfully'
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
};

export default handler;
