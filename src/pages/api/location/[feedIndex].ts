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
  const { GTFS_API, GTFS_API_KEY } = process.env;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };
  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    const { feedIndex } = req.query as LocationRequest;

    // Fetch location data for agency:
    const locationResponse = await fetch(`${GTFS_API}/api/v1/location/${feedIndex}`, options);
    const location: any = await locationResponse.json();

    res.status(200).json(location);
  }
};

export default handler;
