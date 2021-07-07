import type { NextApiRequest, NextApiResponse } from 'next';
// import stationsMTA from '../../../config/shapefiles/MTA/stations';
// import stationsTriMet from '../../../config/shapefiles/TriMet/stations';
import { getKeyValue } from '../../helpers/functions';
import shapeFiles from '../../../config/shapefiles';
import { ShapeFileData } from '../../../config/shapefiles';

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