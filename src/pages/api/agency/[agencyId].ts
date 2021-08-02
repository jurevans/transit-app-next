import type { NextApiRequest, NextApiResponse } from 'next';

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
  const { feedIndex, agencyId } = req.query;

  if (req.method === 'GET') {
    // Fetch agency data for this feed:
    const agenciesResponse: any = await fetch(`${GTFS_API}/api/v1/agency/${feedIndex}/id/${agencyId}`);
    const agencies = await agenciesResponse.json();

    if (agencies) {
      res.status(200).json(agencies);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving agency data' } });
    }
  }
};

export default handler;
