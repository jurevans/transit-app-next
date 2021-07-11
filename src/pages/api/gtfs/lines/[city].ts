/**
 * Deliver combined GTFS data for shapes, routes, trips to MapBox layers
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getKeyValue } from '../../../../helpers/functions';
import { MongoClient } from 'mongodb';

type LinesRequest = {
  city: string;
};

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
    const { city } = req.query as LinesRequest;

    const makeRequest = async () => {
      const { MONGO_DB_CONNECT_STRING: uri } = process.env;
      const client = await new MongoClient(uri as string, { useNewUrlParser: true, useUnifiedTopology: true })

      try {
        await client.connect()
          .catch((e: any) => console.error(e));

        const db = await client.db('gtfs');
        const calendar = await db.collection('calendar');

        const response = await calendar.aggregate([
          { $match: { sunday: '1' } },
          {
            $lookup: {
              from: 'trips',
              localField: 'service_id',
              foreignField: 'service_id',
              as: 'services',
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
