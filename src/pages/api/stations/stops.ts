import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS data for stops
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API } = process.env;
  const { feedIndex } = req.query;

  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/stops/${feedIndex}`;
    const stopsResponse: any = await fetch(endpoint);
    const stops = await stopsResponse.json();

    if (stops) {
      res.status(200).json(stops);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving stops' } });
    }
 }
};

export default handler;
