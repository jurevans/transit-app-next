import type { NextApiRequest, NextApiResponse } from 'next';
import stationsMTA from '../../../config/shapefiles/MTA/stations';
import stationsTriMet from '../../../config/shapefiles/TriMet/stations';
import { StationsGeoData } from '../../helpers/map'

/**
 * API Route to load static data
 * @param req 
 * @param res 
 */
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<StationsGeoData>
) => {
  /* TODO: Clean this up a bit */
  if (req.method === 'GET') {
    const { city } = req.query;
    console.log('QUERY', city);
    if (city) {
      if (city === 'nyc') {
        res.status(200).json(stationsMTA);
      }
      if (city === 'portland') {
        res.status(200).json(stationsTriMet);
      }
    } else {
      res.status(200).json(stationsMTA);
    }
  }
};

export default handler;