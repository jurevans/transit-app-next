/**
 * Api slice
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StationsGeoData } from '../../helpers/map';

export const stationsApiSlice = createApi({
  reducerPath: 'stations',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders(headers) {
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      fetchStations: builder.query<StationsGeoData, string> ({ 
        query(city: string) {
          return `/stations?city=${city}`
        },
      }),
    };
  },
});

export const { useFetchStationsQuery } = stationsApiSlice;
