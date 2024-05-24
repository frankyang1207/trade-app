import React, {useState, useEffect } from 'react';

import { useFormik } from 'formik';
import { 
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  Spacer,
  Flex,
  ButtonGroup,
  useToast, 
} from '@chakra-ui/react';

import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import '../../node_modules/react-bootstrap-typeahead/css/Typeahead.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './app.css';

import { useAuthContext } from '../context/authContext';
import FileUploader from './imageUploader';


const ProfileForm = ({ changePage }) => {
  // get user data from profile page through local storage
  const userFormString = localStorage.getItem('user-form');
  const localFormData = JSON.parse(userFormString);
  const toast = useToast();

  const { userId, accessToken } = useAuthContext();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(localFormData && localFormData.country ? localFormData.country : '');
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(localFormData && localFormData.province ? localFormData.province : '');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(localFormData && localFormData.city ? localFormData.city : '');
  const [avatarImage, setAvatarImage] = useState({ 
    file: undefined,
    preview: localFormData && localFormData.imageLink ? localFormData.imageLink : '',
    url: localFormData && localFormData.imageLink ? localFormData.imageLink : '',
  });


  
  const formik = useFormik({
    initialValues: {
      firstName: localFormData && localFormData.firstName ? localFormData.firstName : '',
      lastName: localFormData && localFormData.lastName ? localFormData.lastName : '',
      phoneNumber: localFormData && localFormData.phoneNumber ? localFormData.phoneNumber : '',
      postalCode: localFormData && localFormData.postalCode ? localFormData.postalCode : '',
      email: localFormData && localFormData.email ? localFormData.email : '',
      streetAddress: localFormData && localFormData.streetAddress ? localFormData.streetAddress : '',
    },
    onSubmit: () => {
      const res = updateUser();
      if (res.ok){
        localStorage.removeItem('user-form');
        changePage('userProfilePage');
      }
      },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      postalCode: Yup.string().required('Required'),
      firstName: Yup.string(),
      lastName: Yup.string(),
      phoneNumber: Yup.string(),
      streetAddress: Yup.string(),
    })
  });


  const updateUser = async () => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken};
    const method = 'PUT';
    const body = JSON.stringify({
      'user_image_link': avatarImage.url,
      'user_email': formik.values.email, 
      'user_first_name': formik.values.firstName,
      'user_last_name': formik.values.lastName,
      'user_phone': formik.values.phoneNumber,
      'user_postal_code': formik.values.postalCode,
      'user_street_address': formik.values.streetAddress,
      'user_country': selectedCountry,
      'user_province': selectedProvince,
      'user_city': selectedCity,
      'user_id': userId
    });
    try {
      const response = await fetch('http://localhost:9000/user', { method, headers, body });
      const resObj = await response.json();
      if (response.ok) {
        toast({
          title: 'Success',
          description: resObj.message,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Failed',
          description: resObj.error,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        })
      }
      return response;
    }
    catch (error) {
      console.log(error)
    }
  }  
  
  useEffect(() => {
    fetchCountries();
  }, [])




  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/info?returns=name', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch country list');
      }
  
      const responseData = await response.json();
      setCountries(responseData.data);
    }
    catch (error) {
      console.log(error)
    }
  }

  const fetchProvinces = async (country) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "country": country
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch province list');
      }
  
      const responseData = await response.json();
      setProvinces(responseData.data.states);
   
      }
    catch (error) {
      console.log(error)
    }
  }

  const fetchCities = async (province) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "country": selectedCountry,
          "state": province
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch province list');
      }
      const responseData = await response.json();
      setCities(responseData.data);
      }
    catch (error) {
      console.log(error)
    }
  }

  // handle return to user profile page
  const handleReturn = () => {
    localStorage.removeItem('user-form');
    changePage('userProfilePage');
  }



  return (
    <VStack padding='140px 0 '>
      <form onSubmit ={formik.handleSubmit} style={{width:'50%'}}>
        <FileUploader image={avatarImage} setImage={setAvatarImage} dirName='user-avatar-images' imageType='user' />
          <FormControl mt={3} isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              placeholder='Enter your email'
              {...formik.getFieldProps('email')}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <Flex>
            <FormControl mt={3} flex='1' mr={2}>
              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                placeholder='Enter your first name'
                {...formik.getFieldProps('firstName')}
              />
            </FormControl>
            <FormControl mt={3} flex='1' ml={2}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                placeholder='Enter your last name'
                {...formik.getFieldProps('lastName')}
              />
            </FormControl>
          </Flex>
          <Flex>
            <FormControl mt={3} flex='1' mr={2}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type='tel'
                placeholder='Enter your phone number'
                {...formik.getFieldProps('phoneNumber')}
              />
            </FormControl>
            <FormControl mt={3} flex='1' ml={2} isInvalid={formik.touched.postalCode && formik.errors.postalCode}>
              <FormLabel>Postal Code</FormLabel>
              <Input
                type='text'
                placeholder='Enter your postal code'
                {...formik.getFieldProps('postalCode')}
              />
            <FormErrorMessage>{formik.errors.postalCode}</FormErrorMessage>
          </FormControl>
        </Flex>
          
        <Flex>
          <FormControl mt={3} flex='1' mr={2}>
            <FormLabel>Country</FormLabel>
            <Typeahead
              id='country-typeahead'
              placeholder='Enter your country'
              defaultInputValue={localFormData && localFormData.country ? localFormData.country : ''}
              onInputChange={(text)=> {
                setSelectedCountry(text);
              }}
              onChange={([selected]) => {
                if (selected && selected.label) {
                  setSelectedCountry(selected.label);
                  fetchProvinces(selected.label);
                }
              }}
              options={[]}
            />
          </FormControl>

          <FormControl mt={3} flex='1' ml={2} mr={2}>
            <FormLabel>Province</FormLabel>
            <Typeahead
              id='province-typeahead'
              placeholder='Enter your province'
              defaultInputValue={localFormData && localFormData.province ? localFormData.province : ''}
              onChange={([selected]) => {
                if (selected && selected.label) {
                  setSelectedProvince(selected.label);
                  fetchCities(selected.label);
                }
              }}
              options={provinces && provinces.map(province => ({ label: province.name }))}
            />
          </FormControl>

          <FormControl mt={3} flex='1' ml={2}>
            <FormLabel>City</FormLabel>
            <Typeahead
              id='city-typeahead'
              placeholder='Enter your city'
              defaultInputValue={localFormData && localFormData.city ? localFormData.city : ''}
              onChange={([selected]) => {
                  if (selected) {
                  setSelectedCity(selected);
                }
              }}
              options={cities}
            />
          </FormControl>
        </Flex>

        

        <FormControl mt={3}>
          <FormLabel>Street Address</FormLabel>
          <Input
            type='text'
            placeholder='Enter your street address'
            {...formik.getFieldProps('streetAddress')}
          />
        </FormControl>

        <Flex mt={3}>
          <Spacer />
          <ButtonGroup gap='2'>
            <Button colorScheme='teal' onClick={handleReturn}>Return</Button>
            <Button type='submit' colorScheme='teal'>Submit</Button>
          </ButtonGroup>
          <Spacer />
        </Flex>

      </form>
    </VStack>
  );
};
  export default ProfileForm;