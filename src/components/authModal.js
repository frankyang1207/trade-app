import { useState, useEffect  } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Flex,
  useToast, 
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useAuthContext } from '../context/authContext';

// this component handles the modal for account related actions
const AuthModal = ({ isOpen, onClose, mode }) => {
  const toast = useToast()
  const [isFetching, setIsFetching] = useState(false);
  const { isLoggedin, userId, onLogin, accessToken } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      firstName:'',
      lastName:'',
      phoneNumber:'',
      email:'',
      password:'',
    },
    onSubmit: () => {
      setIsFetching(true);
    },
    // if it is profile modal, password is not required
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: mode === 'profile' ? Yup.string() : Yup.string().required('Required')

    })
  });

  // fetch helper function
  const handleFetch = async (url, method, headers, body) => {
    try {
      const response = await fetch(url, { method, headers, body });
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
        if (mode === 'login') {
          onLogin(resObj.refresh_token, resObj.access_token, resObj.user_id, resObj.user_role);
        }
        formik.resetForm();
        onClose();
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
    } catch (error) {
      console.log(error);
    }
    
  };

  // fetch for login
  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify({ 
        'user_email': formik.values.email, 
        'user_password': formik.values.password 
      });
      await handleFetch('http://localhost:9000/login', 'POST', headers, body);
    };

    if (isFetching && mode === 'login') {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching]);

  // fetch for register
  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Content-Type': 'application/json'};
      const body = JSON.stringify({ 
        'user_email': formik.values.email, 
        'user_password': formik.values.password,
        'user_first_name': formik.values.firstName,
        'user_last_name': formik.values.lastName,
        'user_phone': formik.values.phoneNumber
      });
      await handleFetch('http://localhost:9000/user', 'POST', headers, body);
    };

    if (isFetching && mode === 'register') {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching]);

  // fetch for get profile
  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
      const method = 'GET';
      try {
        const response = await fetch(`http://localhost:9000/user/${userId}`, {method, headers});
        if (response.ok) {
          const resObj = await response.json();
          formik.setValues({
            ...formik.values,
            email: resObj.user_email,
            firstName: resObj.user_first_name,
            lastName: resObj.user_last_name,
            phoneNumber: resObj.user_phone,
          });
        }
      }
      catch (error) {
        console.log(error);
      }
    };

    if (mode === 'profile' && isLoggedin) {
      fetchData();
    }
  }, [isOpen]);

  // fetch for update profile
  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken};
      const body = JSON.stringify({ 
        
        'user_email': formik.values.email, 
        'user_first_name': formik.values.firstName,
        'user_last_name': formik.values.lastName,
        'user_phone': formik.values.phoneNumber,
        'user_id': userId
      });
      await handleFetch('http://localhost:9000/user', 'PUT', headers, body);
    };
    if (isFetching && mode === 'profile') {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalOverlay />
      <ModalContent>
        
      <form onSubmit ={formik.handleSubmit}>
        <ModalHeader>{mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Profile'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              placeholder='Enter your email'
              {...formik.getFieldProps('email')}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
           {mode !== 'login' &&
           <>
           <Flex>
            <FormControl mt={4} flex='1' mr={2}>
              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                placeholder='Enter your first name'
                {...formik.getFieldProps('firstName')}
              />
            </FormControl>
            <FormControl mt={4} flex='1' ml={2}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                placeholder='Enter your last name'
                {...formik.getFieldProps('lastName')}
              />
            </FormControl>
          </Flex>
          <FormControl mt={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type='tel'
              placeholder='Enter your phone number'
              {...formik.getFieldProps('phoneNumber')}
            />
          </FormControl>
          </>}
          {mode !== 'profile' &&
          <>
          <FormControl mt={4} isInvalid={formik.touched.password && formik.errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              placeholder='Enter your password'
              {...formik.getFieldProps('password')}
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          </>}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            <Button type='submit' colorScheme='teal' isDisabled={isFetching} >Submit</Button>
          </HStack>
        </ModalFooter>
        </form>
      </ModalContent>
      
    </Modal>
  );
};

export default AuthModal;