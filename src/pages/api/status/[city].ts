import type { NextApiRequest, NextApiResponse } from 'next';
import cities from '../../../settings/cities';
import * as xml2js from 'xml2js';

type ServiceRequest = {
  city: string;
};

/**
 * API Route to load static data for stations
 * @param req 
 * @param res 
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    const { city } = req.query as ServiceRequest;
    const config = cities.find(config => config.id === city);

    if (!config?.settings.serviceStatusEndpoint) {
      res.status(404).end();
    } else {
      const { serviceStatusEndpoint } = config.settings;
      // Fetch service status, then parse XML -> JSON, then return
      const response = await fetch(serviceStatusEndpoint);
      const xml = await response.text();
      const parser = new xml2js.Parser();
      // TODO: handle any errors:
      const result = await parser.parseStringPromise(xml);

      res.status(200).json(JSON.stringify(result));
    }
  }
};

export default handler;