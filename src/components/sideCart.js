import React, { useEffect } from 'react';
import { Box, VStack, HStack, Button, Heading, Image } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, decreaseCart, addToCart, getTotals } from "../features/cartSlice";
import { useCartContext } from '../context/cartContext';

const SideCart = ({ changePage }) => {
  const { onOpenCart, onCloseCart, state } = useCartContext();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getTotals());
  }, [cart, dispatch])

  const handleRemoveFromCart = (cartItem) => {
      dispatch(removeFromCart(cartItem));
  }

  const handleDecreaseCart = (cartItem) => {
      dispatch(decreaseCart(cartItem));
  }

  const handleIncreaseCart = (cartItem) => {
      dispatch(addToCart(cartItem));
  }

  const handleChangePage = () => {
    onCloseCart();
    changePage('cartPage');
  }

  return (
    <Box
      position="fixed"
      top="0"
      right={state.isOpen ? '0' : '-350px'} 
      bottom="0"
      width="350px"
      h='100%'
      bg="white"
      boxShadow="lg"
      transition="right 0.3s ease"
      zIndex="2"
    >
      <HStack h='17.5%' p='10' backgroundColor="teal.300">
        <FontAwesomeIcon 
          onClick={onCloseCart} 
          style={{cursor: 'pointer', marginTop: 5}} 
          icon={ faChevronRight }  
        />
        <Heading style={{margin:'5px 0 0 30%'}} as='h1' fontSize="lg">My Cart</Heading>
      </HStack>
      { cart.cartItems && cart.cartItems.length > 0 ?
      <VStack h='82.5%'>
        <VStack h='65%' w='100%' mt={4} align='start' justify='start' style={{overflow:'auto'}}>
          {cart.cartItems?.map(cartItem => (
            <VStack  w='100%' h='100%' marginBottom='auto'  key={cartItem.product_id}>
              <HStack w='90%' p={5} style={{ borderBottom:'1px solid black'}}>
                <Image 
                  src={cartItem.product_image_link} 
                  alt={cartItem.product_name} 
                  height='100px' 
                  width='90px'
                  style={{marginRight:'20px'}}
                />
                <VStack align='start' >
                  <h6 style={{marginBottom:0}}>{cartItem.product_name}</h6>
                  <p style={{marginBottom:0}}>${cartItem.product_price}</p>
                  <HStack justify='center' 
                    style={{width: '60px',border:'1px solid black', borderRadius:'5px'}}
                  >
                    <button
                        onClick={() => handleDecreaseCart(cartItem)}
                    >
                        -
                    </button>
                    <div className="count">{cartItem.cartQuantity}</div>
                    <button 
                      onClick={() => handleIncreaseCart(cartItem)}
                    >
                      +
                    </button>
                  </HStack>
                </VStack>
              <FontAwesomeIcon 
                onClick={() => handleRemoveFromCart(cartItem)} 
                style={{cursor: 'pointer', margin:'0 0 auto auto'}} 
                icon={ faXmark }  
              />
            </HStack>
          </VStack>
          ))}
        
        </VStack>
        
        <VStack h='35%'>
          <VStack mt={3} h='50%' w='100%' align='start'>
            <Heading fontSize={24}>Subtotal</Heading>
            <Heading fontSize={24}>${Math.round(cart.cartTotalAmount * 100)/100}</Heading>
          </VStack>
          <VStack h='50%'>
           <Button w='300px' colorScheme={'teal'} onClick={() => {handleChangePage()}}>View Cart</Button>
          </VStack>
        </VStack>
      </VStack>
      : 
      <p style={{marginTop:'30px'}}>Cart is empty</p>
      
      }
    </Box>
  );
};



export default SideCart;
