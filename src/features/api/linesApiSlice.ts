/**
 * Api slice
 */
 import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
 
 export const linesApiSlice = createApi({
   reducerPath: 'lines',
   baseQuery: fetchBaseQuery({
     baseUrl: '/api',
     prepareHeaders(headers) {
       return headers;
     },
   }),
   endpoints(builder) {
     return {
       fetchLines: builder.query<any, string> ({ 
         query(city: string) {
           return `/lines?city=${city}`
         },
       }),
     };
   },
 });
 
 export const { useFetchLinesQuery } = linesApiSlice;
 