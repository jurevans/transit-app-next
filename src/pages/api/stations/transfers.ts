import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS data for transfers
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
    const endpoint = `${GTFS_API}/api/v1/stops/${feedIndex}/transfers`;
    const transfersResponse: any = await fetch(endpoint);
    const transfers = await transfersResponse.json();

    if (transfers) {
      res.status(200).json(transfers);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving transfers' } });
    }
 }
};

export default handler;
