import React, { useState } from 'react';
import { 
  Box,
  HStack,
  Image,
  Button,
  useToast,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faBagShopping } from '@fortawesome/free-solid-svg-icons'

import { useAuthContext } from '../context/authContext';
import { useCartContext } from '../context/cartContext';
import handleFetch from '../utils/handleFetch';
const logo = require('../images/logo-Placeholder.jpg');


const Header = ({ changePage, setLoginModalOpen, setRegisterModalOpen, setPostModalOpen }) => {


  const { cartTotalQuantity } = useSelector(state => state.cart);
  const toast = useToast();
  const { isLoggedin, refreshToken, userImageLink, onLogout } = useAuthContext();
  const { onOpenCart } = useCartContext();

  const openLoginModal = () => setLoginModalOpen(true);
  const openRegisterModal = () => setRegisterModalOpen(true);
  const openPostModal = () => setPostModalOpen(true);


  // remove form from local storage during page change
  const cleanPageChange = (page) => {
    localStorage.removeItem('user-form');
    changePage(page);
  }

 
  
  // handle log out
  const logout = async () => {
    const url = 'https://trade-app-api-ptxs.onrender.com/logout';
    const headers = { 'Content-Type': 'application/json' };
    const method = 'DELETE';
    const body = JSON.stringify({ 'token': refreshToken });
    handleFetch(url, headers, method, body, onLogout, toast);
    localStorage.removeItem('user-form');
    changePage('landingPage');
  }

  return (
    <Box padding='20px 100px' position='fixed' width='100%' backgroundColor='white' boxShadow='lg' zIndex={1}>
      
      <HStack
        justifyContent='space-between'
        alignItems='center'
      >
        <nav>
          <Image style={{cursor: 'pointer'}} onClick={() => cleanPageChange('landingPage')} src={logo} height='50px'></Image>
        </nav>
        <nav>
          <HStack>
            {(!isLoggedin) ?
              <>
                <Button colorScheme='teal' variant='outline' onClick={openLoginModal} >Login</Button>
                <Button colorScheme='teal' variant='outline' onClick={openRegisterModal} >Register </Button>
              </>
            :
              <>
              <FontAwesomeIcon color='teal' onClick={openPostModal} style={{cursor: 'pointer'}} icon={ faSquarePlus } size='3x' />
              <Menu>
              <MenuButton isRound as={IconButton} icon={<Avatar name='' 
                src={userImageLink ? userImageLink : 'https://bit.ly/broken-link'} />}>
              </MenuButton>
                <MenuList color='teal'>
                  <MenuItem onClick={() => changePage('userProfilePage')} >Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
              </>
            }
            <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
              <FontAwesomeIcon 
                color='teal' 
                icon={ faBagShopping } 
                onClick={onOpenCart}
                style={{cursor: 'pointer'}}
                size='3x' 
              />
              <span 
                style={{ 
                  position:'absolute', 
                  bottom:'10%', 
                  color:'white', 
                  backgroundColor:'teal', 
                  width:'90%',
                  cursor: 'pointer',
                  }}
                onClick={onOpenCart}>
                {cartTotalQuantity}
              </span>
            </div>
          </HStack>
        </nav>
      </HStack>
    </Box>
    );
  };
  export default Header;