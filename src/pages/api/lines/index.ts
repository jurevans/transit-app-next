import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS data for lines
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API, GTFS_API_KEY } = process.env;
  const { feedIndex } = req.query;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };
  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/geo/${feedIndex}/shapes?geojson=true`;
    const linesResponse: any = await fetch(endpoint, options);
    const lines = await linesResponse.json();

    if (lines) {
      res.status(200).json(lines);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving route shape data' } });
    }
 }
};

export default handler;
