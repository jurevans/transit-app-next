import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS Realtime data by station IDs
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API, GTFS_API_KEY } = process.env;
  const { feedIndex, id } = req.query;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };
  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/gtfs/${feedIndex}/stations/${id}`;
    const gtfsResponse: any = await fetch(endpoint, options);
    const gtfs = await gtfsResponse.json();

    res.status(200).json(gtfs);
  }
};

export default handler;
