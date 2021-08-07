import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to retrieve GTFS real-time route data by ID
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API } = process.env;
  const { feedIndex, routeId } = req.query;

  if (req.method === 'GET') {
    // Fetch real-time updates by routeId for this feed:
    const routeResponse: any = await fetch(`${GTFS_API}/api/v1/gtfs/${feedIndex}/route/${routeId}`);
    const route = await routeResponse.json();

    res.status(200).json(route);
  }
};

export default handler;
