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
        const routes = await db.collection('routes');
        const response = await routes.aggregate([
          {
            $project: {
              _id: 0,
              id: '$route_id',
              name: '$route_short_name',
              longName: '$route_long_name',
              description: '$route_desc',
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
