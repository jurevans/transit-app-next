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
  const { GTFS_API } = process.env;
  const { feedIndex, id } = req.query;

  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/gtfs/${feedIndex}/stations/${id}`;
    const gtfsResponse: any = await fetch(endpoint);
    const gtfs = await gtfsResponse.json();

    if (gtfs) {
      res.status(200).json(gtfs);
    } else {
      res.status(500).json({
        error: {
          details: 'There was an error retrieving GTFS realtime data for station IDs',
        },
      });
    }
  }
};

export default handler;
