import type { NextApiRequest, NextApiResponse } from 'next';
import linesMTA from '../../../config/shapefiles/MTA/lines';
import linesTriMet from '../../../config/shapefiles/TriMet/lines';

/**
 * API Route to load static data
 * @param req 
 * @param res 
 */
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  /* TODO: Clean this up a bit */
  if (req.method === 'GET') {
    const { city } = req.query;
    console.log('QUERY', city);
    if (city) {
      if (city === 'nyc') {
        res.status(200).json(linesMTA);
      }
      if (city === 'portland') {
        res.status(200).json(linesTriMet);
      }
    } else {
      res.status(200).json(linesMTA);
    }
  }
};

export default handler;