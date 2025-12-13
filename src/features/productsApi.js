import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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