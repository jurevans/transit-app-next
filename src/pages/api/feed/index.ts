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
  const { GTFS_API, GTFS_API_KEY } = process.env;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };
  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    // Fetch agency data for this feed:
    const feedsResponse: any = await fetch(`${GTFS_API}/api/v1/feed`, options);
    const feeds = await feedsResponse.json();

    if (feeds) {
      res.status(200).json(feeds);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving agency data' } });
    }
  }
};

export default handler;
