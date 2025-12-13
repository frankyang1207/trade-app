import { Heading, HStack, Image, Text, VStack, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthContext } from '../context/authContext';
import ProductModal from "./productModal";
import axios from "axios";

const Card = (props) => {
  const { product, reRenderProducts, changePage } = props;
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const { userId, userRole, accessToken } = useAuthContext();
  const closeModifyModal = () => {
    setModifyModalOpen(false);
    reRenderProducts();  
  }
  const toast = useToast();
  
  const handleDetailPage = () => {
    localStorage.setItem('product', JSON.stringify(product));
    changePage('productDetailPage');
  }

  const handleModify = (e) => {
    // prevent parent event of going to detail page
    e.stopPropagation();
    setModifyModalOpen(true);
  }

   // handle product removal
  const handleRemoval = async (e) => {
    e.stopPropagation();
    const url = process.env.REACT_APP_API + `/api/v1/product/${product.product_id}`;
    const headers = { 'Authorization': 'Bearer ' + accessToken  };
    try {
      const response = await axios.delete(url, {headers});
      if (response && response.status && response.status === 200) {
        toast({
          title: 'Success',
          description: response.data.message,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        reRenderProducts();
      } else {
        toast({
          title: 'Failed',
          description: response.data.message,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div 
      style={{backgroundColor: "white", borderRadius: "10px", borderWidth: '3px', borderColor: '#E2E8F0', cursor: 'pointer'}}
      onClick={handleDetailPage}
    >
      <Image src={product.product_image_link} padding="10px 10px 0px 10px" borderRadius="10px" width="350px" height="400px"></Image>
      <VStack spacing="2" color="black" margin="20px" align="start" height="30px">
        <HStack justifyContent='space-between' alignItems='center' width='100%'>
          <Heading size="sm" >{product.product_name}</Heading>
          <Text>${product.product_price}</Text>
        </HStack>
      </VStack>
      {((product.product_owner === userId) || (userRole === "ADMIN")) ?
        <HStack alignItems="center" justifyContent="center" margin="20px">
          <Button colorScheme='teal' variant='solid' onClick={handleModify} >Modify</Button>    
          <Button colorScheme='teal' variant='solid' onClick={handleRemoval} >Remove</Button>
        </HStack>
        : 
        null
      }
      <ProductModal 
        isOpen={isModifyModalOpen}
        onClose={closeModifyModal}
        mode='modify'
        id={product.product_id}
        imageSrc={product.product_image_link}
        name={product.product_name}
        price={product.product_price}
        quantity={product.product_quantity}
        forMale={product.product_for_male}
        forFemale={product.product_for_female}
        description={product.product_description}
      />
    </div>
    )
};

export default Card;
