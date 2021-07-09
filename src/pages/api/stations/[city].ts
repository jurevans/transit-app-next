import type { NextApiRequest, NextApiResponse } from 'next';
import { getKeyValue } from '../../../helpers/functions';
import shapeFiles from '../../../../data/shapeFiles';
import { ShapeFileData } from '../../../../data/shapeFiles';

type StationsRequest = {
  city: string;
};

/**
 * API Route to load static data for stations
 * @param req 
 * @param res 
 */
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<ShapeFileData>
) => {
  if (req.method === 'GET') {
    const { city } = req.query as StationsRequest;
    const stationsData: ShapeFileData = getKeyValue(shapeFiles)(city);

    if (stationsData && stationsData.stations) {
      res.status(200).json(stationsData.stations);
    } else {
      res.status(404).end();
    }
  }
};

export default handler;