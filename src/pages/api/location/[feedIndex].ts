import type { NextApiRequest, NextApiResponse } from 'next';

type LocationRequest = {
  feedIndex: string;
};

/**
* API Route to retrieve location based on data in GTFS agency table
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API } = process.env;
  if (req.method === 'GET') {
    const { feedIndex } = req.query as LocationRequest;

    // Fetch location data for agency:
    const locationResponse = await fetch(`${GTFS_API}/api/v1/location/${feedIndex}`);
    const location: any = await locationResponse.json();

    if (location) {
      res.status(200).json(location);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving location' } });
    }
 }
};

export default handler;
