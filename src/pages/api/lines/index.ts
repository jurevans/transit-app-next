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
  const { GTFS_API } = process.env;
  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/shapes?geojson=true`;
    const linesResponse: any = await fetch(endpoint);
    const lines = await linesResponse.json();

    if (lines) {
      res.status(200).json(lines);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving route shape data' } });
    }
 }
};

export default handler;