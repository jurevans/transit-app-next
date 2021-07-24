import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS data for stations
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API } = process.env;
  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/stops`;
    const stationsResponse: any = await fetch(endpoint);
    const stations = await stationsResponse.json();

    if (stations) {
      res.status(200).json(stations);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving stations' } });
    }
 }
};

export default handler;