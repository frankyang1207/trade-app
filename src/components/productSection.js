import React, {useState, useEffect } from 'react';
import { Box, Heading, VStack } from "@chakra-ui/react";
import Card from "./card";

const ProductsSection = ({ refreshSwitch, onUpdateProduct }) => {
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const imageSrc = "../images/cardboard-box-taped-up.jpg"

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const headers = { 'Content-Type': 'application/json' };
        const method = 'GET';
        const response = await fetch('http://localhost:9000/products', {method, headers});
        const resObj = await response.json();
        console.log(resObj)
        if (response.ok) {
          setProducts(resObj);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
      fetchData();
  }, [refreshSwitch]);

 
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
          {products && products.map((product) => (
            <Card
              key={product.product_id}
              id={product.product_id}
              owner={product.product_owner}
              name={product.product_name}
              price={product.product_price}
              description={product.product_description}
              imageSrc={imageSrc}
              onCardChange={onUpdateProduct}
            />
          ))}
        </Box>
      </VStack>
    </VStack>
  );
};

export default ProductsSection;
