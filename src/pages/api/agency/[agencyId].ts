import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to retrieve GTFS agency data
* @param req 
* @param res 
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API, GTFS_API_KEY } = process.env;
  const { feedIndex, agencyId } = req.query;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };
  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    // Fetch agency data for this feed:
    const agenciesResponse: any = await fetch(`${GTFS_API}/api/v1/agency/${feedIndex}/id/${agencyId}`, options);
    const agencies = await agenciesResponse.json();

    if (agencies) {
      res.status(200).json(agencies);
    } else {
      res.status(404).json({ error: { details: 'There was an error retrieving agency data' } });
    }
  }
};

export default handler;
