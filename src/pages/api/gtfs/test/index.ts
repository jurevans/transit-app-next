/**
 * TEST ENDPOINT -> PostgreSQL/TypeORM
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrCreateConnection } from 'src/helpers/db';
/**
 * API Route to load static data for lines
 * @param req
 * @param res
 */

const connect = async () => {
  const conn = await getOrCreateConnection();
  console.log(conn);
};

connect();

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    res.json([]);
  }
};

export default handler;
