import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to retrieve GTFS static route data
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
    // Fetch routes data for this feed:
    const routesResponse: any = await fetch(`${GTFS_API}/api/v1/routes/${feedIndex}`);
    const routes = await routesResponse.json();

    res.status(200).json(routes);
  }
};

export default handler;
