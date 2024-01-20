import React, {useState, useEffect } from 'react';
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
  VStack 
  } from '@chakra-ui/react';
import AuthModal from './authModal';
import ProductModal from './productModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'

import { useAuthContext } from '../context/authContext';
import handleFetch from '../utils/handleFetch';
const logo = require('../images/logo-Placeholder.jpg');


const Header = ({ onAddProduct }) => {
  const toast = useToast();
  const { isLoggedin, refreshToken, onLogout } = useAuthContext();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false); 

  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false); 

  const openPostModal = () => setPostModalOpen(true);

  const closePostModal = () => {
    setPostModalOpen(false); 
    // update app.js and its children
    onAddProduct();
  }
  const logout = () => setIsFetching(true);
  
  // handle log out
  useEffect(() => {
    if (isFetching) {
      const url = 'http://localhost:9000/logout';
      const headers = { 'Content-Type': 'application/json' };
      const method = 'DELETE';
      const body = JSON.stringify({ 'token': refreshToken });
      handleFetch(url, headers, method, body, onLogout, toast);
      setIsFetching(false);
    }
  }, [isFetching]);

    return (
      <Box padding='20px 100px' position='fixed' width='100%' backgroundColor='white' boxShadow='lg'>
        <HStack
          justifyContent='space-between'
          alignItems='center'
        >
          <nav>
              <Image src={logo} height='50px'></Image>
          </nav>
          {(!isLoggedin) ?
          <nav>
            <HStack>
              <Button colorScheme='teal' variant='outline' onClick={openLoginModal} >Login</Button>
              <Button colorScheme='teal' variant='outline' onClick={openRegisterModal} >Register </Button>
            </HStack>
          </nav>
          :
          <nav>
            <HStack>
              <IconButton
                onClick={openPostModal}
                variant='outline'
                colorScheme='teal'
                icon={<FontAwesomeIcon color='teal' icon={ faSquarePlus } size='3x' />}
              />
              <Menu>
              <MenuButton isRound as={IconButton} icon={<Avatar src='https://bit.ly/broken-link' />}>
              </MenuButton>
                <MenuList color='teal'>
                  <MenuItem onClick={openProfileModal} >Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </nav>}
        </HStack>
        <AuthModal isOpen={isLoginModalOpen} onClose={closeLoginModal} mode='login' />
        <AuthModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} mode='register' />
        <AuthModal isOpen={isProfileModalOpen} onClose={closeProfileModal} mode='profile' />
        <ProductModal isOpen={isPostModalOpen} onClose={closePostModal} mode='post'/>
      </Box>
    );
  };
  export default Header;