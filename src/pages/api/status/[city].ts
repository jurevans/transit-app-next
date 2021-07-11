import type { NextApiRequest, NextApiResponse } from 'next';
import * as xml2js from 'xml2js';
import cities from '../../../settings/cities';
import { getKeyValueFromArray } from '../../../helpers/functions';

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
    const config = getKeyValueFromArray('id', city, cities);

    if (!config?.settings.serviceStatusEndpoint) {
      res.status(200).json(JSON.stringify([]));
    } else {
      const { serviceStatusEndpoint } = config.settings;
      // Fetch service status, then parse XML -> JSON, then return
      const response = await fetch(serviceStatusEndpoint);
      const xml = await response.text();
      const parser = new xml2js.Parser();
      // TODO: handle any errors:
      const result = await parser.parseStringPromise(xml);
      const normalized = result.service.subway[0].line.map((status: any) => {
        return {
          date: status.Date[0],
          time: status.Time[0],
          name: status.name[0],
          status: status.status[0],
          text: status.text[0],
        }
      });

      res.status(200).json(JSON.stringify(normalized));
    }
  }
};

export default handler;