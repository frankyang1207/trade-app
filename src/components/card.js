import { Heading, HStack, Image, Text, VStack, Button, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useAuthContext } from '../context/authContext';
import ProductModal from "./productModal";
import handleFetch from "../utils/handleFetch";

const Card = ({ id, name, price, description, owner, imageSrc, onCardChange }) => {
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { userId, userRole, accessToken } = useAuthContext();

  const openModifyModal = () => setModifyModalOpen(true);
  const closeModifyModal = () => {
    setModifyModalOpen(false);
    onCardChange();  // rerender product section 
  }
  const toast = useToast();

   // handle product removal
   useEffect(() => {
    if (isFetching) {
      const url = 'http://localhost:9000/product';
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken  };
      const method = 'DELETE';
      const body = JSON.stringify({ 'product_id': id });
      handleFetch(url, headers, method, body, onCardChange, toast);
      setIsFetching(false);
    }
  }, [isFetching]);

  return (
    <div style={{backgroundColor: "white", borderRadius: "10px", borderWidth: '3px', borderColor: '#E2E8F0'}}>
      <Image src={require("../images/cardboard-box-taped-up.jpg")} borderRadius="10px"></Image>
      <VStack spacing="2" color="black" margin="20px" align="start" height="100px">
        <HStack justifyContent='space-between' alignItems='center' width='100%'>
          <Heading size="sm" >{name}</Heading>
          <Text>${price}</Text>
        </HStack>
        <Text noOfLines={3}>{description}</Text>
      </VStack>
      <HStack alignItems="center" justifyContent="center" margin="20px">
        { ((owner === userId) || (userRole === "ADMIN")) ?
          <>
            <Button colorScheme='teal' variant='solid' onClick={openModifyModal} >Modify</Button>    
            <Button colorScheme='teal' variant='solid' onClick={()=>setIsFetching(true)} >Remove</Button>
          </> :
          <Button colorScheme='teal' variant='solid'>Purchase</Button>
        }
      </HStack>
      <ProductModal 
        isOpen={isModifyModalOpen}
        onClose={closeModifyModal}
        mode='modify'
        id={id}
        name={name}
        price={price}
        description={description}
      />
    </div>
    )
};

export default Card;
