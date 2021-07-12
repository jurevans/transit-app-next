/**
 * Deliver combined GTFS data for shapes, routes, trips to MapBox layers
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

/**
* API Route to load static data for lines
* @param req
* @param res
*/
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    const makeRequest = async () => {
      const { MONGO_DB_CONNECT_STRING: uri } = process.env;
      const client = await new MongoClient(uri as string, { useNewUrlParser: true, useUnifiedTopology: true })

    try {
      await client.connect()
        .catch((e: any) => console.error(e));
        const db = await client.db('gtfs');
        const stations = await db.collection('stops');
        const response = await stations.aggregate([
          // Match only subway stations:
          { $match: { location_type: '1' } },
          // Get necessary fields only:
          {
            $project: {
              _id: 0,
              id: '$stop_id',
              name: '$stop_name',
              coordinates: [
                { $toDouble: '$stop_lon' },
                { $toDouble: '$stop_lat' },
              ],
            },
          },
        ]);

        const data = await response.toArray();
        res.status(200).json(data);
      } catch (e) {
        res.status(500).end();
      } finally {
        client.close();
      }
    };

    makeRequest();
  }
};

export default handler;
