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
  if (req.method === 'GET') {

    // Fetch the agency for this feed:
    const agenciesResponse: any = await fetch(`${GTFS_API}/api/v1/agency`);
    const agencies = await agenciesResponse.json();
    const agency = agencies[0]; // For now, we assume we only have one
    const agencyId = agency.agencyId;

    // Fetch location data for agency:
    const locationResponse = await fetch(`${GTFS_API}/api/v1/agency/${agencyId}`);
    const locationData: any = await locationResponse.json();
    const location = locationData[0];

    if (location) {
      res.status(200).json(location);
    } else {
      res.status(500).json({ error: { details: 'There was an error retrieving location' } });
    }
 }
};

export default handler;