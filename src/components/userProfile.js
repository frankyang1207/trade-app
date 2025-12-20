import React, {useState, useEffect } from 'react';
import { 
  Box,
  Stack,
  HStack,
  VStack,
  Button,
  Avatar,
  Heading,
  Text
  } from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useAuthContext } from '../context/authContext';
import './userProfile.css'

// User profile component
const UserProfile = ({ changePage }) => {
  const { isLoggedin, userId, onLogin, accessToken } = useAuthContext();

  const [userInfo, setUserInfo] = useState({
    imageLink: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    postalCode: '',
    country: '',
    province: '',
    city: '',
    streetAddress: '',
    role: '',
    datetimeCreated: '',
  })

  const datetimeParts = userInfo.datetimeCreated.split('T');
  const dateCreated = datetimeParts[0]
  const [formattedAddress, setFormattedAddress] = useState('');
  

  useEffect(() => {
    fetchData();
  }, [])

  // handle the rendering of a section of profile info
  const infoSection = (title, info) => {
    return (
      <>
        <Text marginTop='30px' fontSize='24px' color='teal'>
          {title}
        </Text>
        <Text fontSize='24px'>
          {info}
        </Text>
      </>
    )
  }

  // fetch for get profile
  const fetchData = async () => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
    const method = 'GET';
    try {
      const response = await fetch(process.env.REACT_APP_API + `/api/v1/user/${userId}`, {method, headers});
      if (response.ok) {
        const resObj = await response.json();
        setUserInfo({
          imageLink: resObj.user_image_link,
          role: resObj.user_role,
          email: resObj.user_email,
          firstName: resObj.user_first_name,
          lastName: resObj.user_last_name,
          phoneNumber: resObj.user_phone,
          postalCode: resObj.user_postal_code,
          country: resObj.user_country,
          province: resObj.user_province,
          city: resObj.user_city,
          streetAddress: resObj.user_street_address,
          datetimeCreated: resObj.user_created_datetime 
        })

      
      // address parts that can be combined into one line with comma seperate them
      let addressParts = [];
      if (resObj.user_city) addressParts.push(resObj.user_city);
      if (resObj.user_province) addressParts.push(resObj.user_province);
      if (resObj.user_postal_code) addressParts.push(resObj.user_postal_code);
      if (resObj.user_country) addressParts.push(resObj.user_country);
      const strAddress = addressParts.join(', ')
      setFormattedAddress(strAddress);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleEdit = () => {
    localStorage.setItem('user-form', JSON.stringify(userInfo));
    changePage('profileFormPage');
  }

  return (
    <VStack paddingTop='140px' marginBottom='30px'>
      <Heading  as="h1" color='black'>
        User Profile
      </Heading>
      <Stack className='pf-layout' direction="row">
        <VStack className='pf-left'>
          
          <Avatar w='330px' h='330px' src={
            userInfo && userInfo.imageLink ? userInfo.imageLink  
            : 'https://bit.ly/broken-link'}/>
          <Box boxSize='100%'>
      
            <Text>
              <FontAwesomeIcon color='teal' icon={ faEnvelope } />
              {' ' +  userInfo.email}
            </Text>
            <Text>
              <FontAwesomeIcon color='teal' icon={ faPhone } />
              {' ' +  userInfo.phoneNumber}
            </Text>
            <Text>
              <FontAwesomeIcon color='teal' icon={ faLocationDot }/> 
              {' '+ formattedAddress}
            </Text>
          </Box>
        </VStack>

        <VStack className='pf-right'>

          <HStack w='100%'>
            <VStack w='50%'>
              {infoSection('First Name', userInfo.firstName)}
            </VStack>
            <VStack w='50%'>
              {infoSection('Last Name', userInfo.lastName)}
            </VStack>
          </HStack>

          <HStack w='100%'>
            <VStack w='50%'>
              {infoSection('Street Address', userInfo.streetAddress)}
            </VStack>
            <VStack w='50%'>
              {infoSection('Joined Date', dateCreated)}
            </VStack>
          </HStack>

          <HStack w='100%'>
            <VStack w='50%'>
              {infoSection('Account Role', userInfo.role)}
            </VStack>
            <VStack w='50%'>
              {infoSection('Status', 'ACTIVE')}
            </VStack>
          </HStack>
          
      <Button margin='30px 0' colorScheme='teal' variant='solid' onClick={() => handleEdit()} >Edit Profile</Button>
        </VStack>
      </Stack>
    </VStack>
  );
};
  export default UserProfile;