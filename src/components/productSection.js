import React, { useEffect, useState } from 'react';
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useDispatch } from 'react-redux';
import { addToCart, getTotals } from '../features/cartSlice';
import Card from "./card";
import { useGetAllProductsQuery } from '../features/productsApi';

const ProductsSection = ({ refreshSwitch, reRenderProducts, changePage }) => {
  const dispatch = useDispatch();
  // const imageSrc = "../images/cardboard-box-taped-up.jpg"
  const { data, refetch  } = useGetAllProductsQuery();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(getTotals());
  }

  useEffect(() => {
    refetch();
  }, [refreshSwitch, refetch]);

  useEffect(() => {
    localStorage.removeItem('product');
  }, []);


 
  return (
    <VStack>
      <VStack
        id='products-section'
        p={8}
        alignItems="flex-start"
        spacing={8}
        maxWidth='1280px'
        marginTop='100px'
      >
        <Heading as="h1" color='black'>
          Featured Products
        </Heading>
        <Box
          display="grid"
          gridTemplateColumns="repeat(3,minmax(0,1fr))"
          gridGap={8}
        >
          {data?.map((product) => (
            <Card
              key={product.product_id}
              product={product}
              reRenderProducts={reRenderProducts}
              addToCart={handleAddToCart}
              changePage={changePage}
            />
          ))}
        </Box>
      </VStack>
    </VStack>
  );
};

export default ProductsSection;
