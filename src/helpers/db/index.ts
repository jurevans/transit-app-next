import { createConnection, getConnection } from 'typeorm';

export const getOrCreateConnection = async () => {
  try {
    const conn = await getConnection();
    return conn;
  } catch (e) {
    return  await createConnection({
      type: 'postgres',
      url: process.env.POSTGRESQL_CONNECTION_STRING,
      schema: 'gtfs',
      logging: true,
      entities: [],
    });
  }
};
