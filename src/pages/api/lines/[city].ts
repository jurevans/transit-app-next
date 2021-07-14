import type { NextApiRequest, NextApiResponse } from 'next';
import { getKeyValue } from 'src/helpers/functions';
import shapeFiles from 'data/shapeFiles';
import { ShapeFileData } from 'data/shapeFiles';

type LinesRequest = {
  city: string;
};

/**
 * API Route to load static data for lines
 * @param req 
 * @param res 
 */
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    const { city } = req.query as LinesRequest;
    const linesData: ShapeFileData = getKeyValue(shapeFiles)(city);

    if (linesData && linesData.lines) {
      res.status(200).json(linesData.lines);
    } else {
      res.status(404).end();
    }
  }
};

export default handler;
