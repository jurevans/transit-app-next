/**
 * Deliver combined GTFS data for shapes, routes, trips to MapBox layers
 * TODO: Determine if /api/gtfs/lines/[routeId] is even necessary, as this is
 * mostly a duplicate of /api/gtfs/lines/
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
    const { routeId } = req.query;

    const makeRequest = async () => {
      const { MONGO_DB_CONNECT_STRING: uri } = process.env;
      const client = await new MongoClient(uri as string, { useNewUrlParser: true, useUnifiedTopology: true })

      try {
        await client.connect()
          .catch((e: any) => console.error(e));
        const db = await client.db('gtfs');
        const calendar = await db.collection('calendar');

        const response = await calendar.aggregate([
          // Get a Weekday type
          { $match: { monday: '1' } },
          // Show only service_id
          { $project: { _id: 0, service_id: '$service_id' } },
          // Lookup trips for this service_id
          {
            $lookup: {
              from: 'trips',
              localField: 'service_id',
              foreignField: 'service_id',
              as: 'tripsData',
            }
          },
          // Match trips to route_id provided by endpoint
          { $match: { 'tripsData.route_id': routeId } },
          // Filter out by empty shape_id
          {
            $project: {
              tripsData: {
                $filter: {
                  input: '$tripsData',
                  as: 'trip',
                  cond: { $ne: [ '$$trip.shape_id', '' ] },
                }
              }
            }
          },
          // We need only on inbound/outbound (direction_id == 1 || 0)
          {
            $project: {
              // Get trips with direction_id == 0
              outbound: {
                $filter: {
                  input: '$tripsData',
                  as: 'trip',
                  cond: { $eq: ['$$trip.direction_id', '0']}
                }
              },
              // Get trips with direction_id == 1
              inbound: {
                $filter: {
                  input: '$tripsData',
                  as: 'trip',
                  cond: { $eq: ['$$trip.direction_id', '1']}
                }
              }
            }
          },
          // Return only first outbound and inbound item
          {
            $project: {
              outbound: { $first: '$outbound' },
              inbound: { $first: '$inbound' },
            },
          },
          // Join routes into route
          {
            $lookup: {
              from: 'routes',
              localField: 'outbound.route_id',
              foreignField: 'route_id',
              as: 'route',
            },
          },
          // Move route out of array
          {
            $project: {
              route: { $first: '$route' },
              outbound: '$outbound',
              inbound: '$inbound',
            }
          },
          // Join shapes on shape_id for outbound
          {
            $lookup: {
              from: 'shapes',
              localField: 'outbound.shape_id',
              foreignField: 'shape_id',
              as: 'outboundShapes',
            }
          },
          // Join shapes on shape_id for inbound
          {
            $lookup: {
              from: 'shapes',
              localField: 'inbound.shape_id',
              foreignField: 'shape_id',
              as: 'inboundShapes',
            }
          },
          // Final cleanup:
          {
            $project: {
              _id: 0,
              id: '$route.route_id',
              route: {
                name: '$route.route_short_name',
                longName: '$route.route_long_name',
                description: '$route.route_desc',
                color: '$route.route_color',
                textColor: '$route.route_text_color',
              },
              outbound: {
                $map: {
                  input: '$outboundShapes',
                  as: 'shape',
                  in: [
                    { $toDouble: '$$shape.shape_pt_lon' },
                    { $toDouble: '$$shape.shape_pt_lat' },
                  ],
                },
              },
              inbound:  {
                $map: {
                  input: '$inboundShapes',
                  as: 'shape',
                  in: [
                    { $toDouble: '$$shape.shape_pt_lon' },
                    { $toDouble: '$$shape.shape_pt_lat' },
                  ],
                },
              },
            },
          },
        ]);

        const data: any = await response.toArray();
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
