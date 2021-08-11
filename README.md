# transit-app-next
The goal of this project is to provide a 3D transit map (based on [DeckGL](https://deck.gl/) and [MapBox](https://www.mapbox.com/)) with real-time updates, utilizing GTFS feed data. This should work with any GTFS dataset (ideally), and will transit types such as subway, rail, bus, etc., so long as it is in GTFS format. This app is built with [NextJS](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Redux Toolkit](https://redux-toolkit.js.org/).

## Setting up the development environment
Before running the app, you need to set up a couple variables in an `.env.local` file,
which needs to be in the root of the project directory:

```
REACT_APP_MAPBOX_ACCESS_TOKEN=XXXXXXXXXXXXXXXXXX
GTFS_API=http://localhost:5000
GTFS_API_KEY=XXXXXXXXXXXXXXXXXXXXXX
```

- MapBox Access Token [MapBox Access Token Help](https://docs.mapbox.com/help/getting-started/access-tokens/)
- URL pointing to the `transit-app-api` [backend](https://github.com/jurevans/transit-app-api/)
- `GTFS_API_KEY` is required to authenticate all requests to the backend.

You need a PostgreSQL database, with PostGIS extensions enabled, and it needs to be populated with a GTFS static feed, which are provided in a `.zip` file provided by the relevant transit authority. This can be imported using the [GTFS Sql Importer](https://github.com/fitnr/gtfs-sql-importer). I am developing this application with PostgreSQL 13/PostGIS 3, but this should work on PostgreSQL 9.5+ with PostGIS 2.2+ (according to the docs on `gtfs-sql-importer`).

## Run the development environment
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/map](http://localhost:3000/map) with your browser to see the result.

## Testing
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Configuration
There are a couple configuration files you may want to tweak to suit your needs. The first is `config/api.config.ts`, where you will specify your production or localhost URLs (`API_URL`). A full URL is required by `NextJS` for all `fetch` requests.

The second file is `config/map.config.ts`. Here you can define the constraints for how far the user can pan the map in any direction for the initial Longitude/Latitude, as well as define the pitch, bearing, initial zoom and zoom constraints that DeckGL will be instantiated with:

```javascript
const mapDefaults = {
  initialView: {
    minZoom: 10.5,
    maxZoom: 15.5,
    bearing: 0,
    pitch: 0,
    zoom: 11.5,
  },
  range: {
    lonMinOffset: .25,
    lonMaxOffset: .25,
    latMinOffset: .25,
    latMaxOffset: .25,
  },
};
```
More configuration options will likely be added soon.

## Icons
To display icons for your transit map, you will need to provide SVG files placed in the `public/icons` folder. The name of the file should identically match the `routeId` used in your GTFS data. Within the `public/icons` folder, the icons should be placed in a folder whose name is identified by the `agencyId` in your `agency` table. This is so the app can load assets regardless of which dataset is provided, and can support more than one transit feed in a single app. For example, the file structure for the NYC MTA (included in this project) follows this convention:
```
public/icons/MTA NYCT/1.svg
public/icons/MTA NYCT/2.svg
public/icons/MTA NYCT/3.svg
...
```

## TODO
This is a work-in-progress! As the API is built out, integrating more of the GTFS static and realtime data, this will be expanded into a more useful web application. The goal is that this project remains suited and easily adapted to any GTFS feed with minimal effort.
