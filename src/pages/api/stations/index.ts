import type { NextApiRequest, NextApiResponse } from 'next';

/**
* API Route to load GTFS data for stations
* @param req
* @param res
*/
const handler = async (
 req: NextApiRequest,
 res: NextApiResponse<any>
) => {
  const { GTFS_API, GTFS_API_KEY } = process.env;
  const { feedIndex } = req.query;

  const headers: HeadersInit = {
    'x-api-key': GTFS_API_KEY as string,
  };

  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  if (req.method === 'GET') {
    const endpoint = `${GTFS_API}/api/v1/geo/${feedIndex}/stops?geojson=true`;
    const stationsResponse: any = await fetch(endpoint, options);
    const stations = await stationsResponse.json();

    stations.features = stations.features.map((feature: any) => {
      const { properties } = feature;
      const routeIds = properties.routeIds.split('-');
      const routeNames = properties.routeNames.split('-');
      const routeLongNames = properties.routeLongNames.split('#');
      const routeColors = properties.routeColors ? properties.routeColors.split('-') : null;
      const routeUrls = properties.routeUrls.split('|');

      const routes = routeIds.map((routeId: string, i: number) => ({
        routeId,
        name: routeNames[i],
        longName: routeLongNames[i],
        color: routeColors ? routeColors[i] : null,
        url: routeUrls[i],
      }))
      .sort((a: any, b: any) => (a.routeId > b.routeId) ? -1 : 1)
      .sort((a: any, b: any) => (a.color > b.color) ? 1 : -1);

      return {
        coordinates: feature.geometry.coordinates,
        properties: {
          name: properties.name,
          id: properties.id,
          routes,
        },
      };
    });

    res.status(200).json(stations.features);
 }
};

export default handler;
