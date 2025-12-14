import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//Slice to set up an API service for fetching all products from an endpoint using RTK Query
export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API + '/' }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/api/v1/products',
        }),
    })

})

export const { useGetAllProductsQuery } = productsApi;