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
  Link,
  Text,
  Spacer
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useAuthContext } from '../context/authContext';

/* 
Reusable modal component that handles user authentication flows(login & registration) 
Using Formik for form state and Chakra UI for layout
Appears when a user attempts to authenticate
*/

const AuthModal = ({ isOpen, onClose, authMode }) => {
  const toast = useToast();
  const [mode, setMode] = useState(authMode); // login/register
  const [isFetching, setIsFetching] = useState(false);
  const { onLogin } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      firstName:'',
      lastName:'',
      phoneNumber:'',
      postalCode:'',
      email:'',
      password:'',
    },
    onSubmit: () => {
      if (mode === 'login') {
        loginAccount();
      } else if (mode === 'register') {
        registerAccount();
      }
    },
    // Postal code is not required during login
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      postalCode: mode === 'login' ? Yup.string() : Yup.string().required('Required'),
      password: Yup.string().required('Required')
    })
  });

  // Generic fetch helper for auth-related calls
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
        if (mode === 'login' || mode === 'register') {
          
          const userInfo = {
            refreshToken: resObj.refresh_token, 
            accessToken: resObj.access_token, 
            userId: resObj.user_id, 
            userRole: resObj.user_role, 
            userImageLink: resObj.user_image_link
          }
          onLogin(
            userInfo
          );
          localStorage.setItem('user-info', JSON.stringify(userInfo));
        }
        // Cleanup
        formik.resetForm();
        onClose();
      } else {
        // API responded but indicates a failed operation
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

  // Login API request
  const loginAccount = async () => {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ 
      'user_email': formik.values.email, 
      'user_password': formik.values.password 
    });
    await handleFetch(process.env.REACT_APP_API + '/api/v1/auth/login', 'POST', headers, body);
  };

  // Registration API request
  const registerAccount = async () => {
    const headers = { 'Content-Type': 'application/json'};
    const body = JSON.stringify({ 
      'user_email': formik.values.email, 
      'user_password': formik.values.password,
      'user_first_name': formik.values.firstName,
      'user_last_name': formik.values.lastName,
      'user_phone': formik.values.phoneNumber,
      'user_postal_code': formik.values.postalCode,
    });
    await handleFetch(process.env.REACT_APP_API + '/api/v1/user', 'POST', headers, body);
  };

  // Switch between login and registration views
  const handleSwitchMode = (nextMode) => setMode(nextMode);

  // Reset modal mode when closing
  const handleClose = () => {
    setMode(authMode);
    onClose();
  }


  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='md'>
      <ModalOverlay />
      <ModalContent>
        
      <form onSubmit ={formik.handleSubmit}>
        <ModalHeader>{mode === 'login' ? 'Login' : 'Register'}</ModalHeader>
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
          <FormControl mt={4} isInvalid={formik.touched.postalCode && formik.errors.postalCode}>
            <FormLabel>Postal Code</FormLabel>
            <Input
              type='text'
              placeholder='Enter your postal code'
              {...formik.getFieldProps('postalCode')}
            />
            <FormErrorMessage>{formik.errors.postalCode}</FormErrorMessage>
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
          <HStack spacing={4} w='100%'>
            {
            mode === 'login' ? 
            <Text m={1}>{'New customer? '}
              <Link color='teal.500' onClick={() => handleSwitchMode('register')}>
                Register
              </Link>
            </Text>
            : 
            <Text m={1}>{'Already registered? '}
              <Link color='teal.500' onClick={() => handleSwitchMode('login')}>
                Login
              </Link>
            </Text>
            }
            <Spacer/>
            <Button type='submit' colorScheme='teal' isDisabled={isFetching} >Submit</Button>
          </HStack>
        </ModalFooter>
        </form>
      </ModalContent>
      
    </Modal>
  );
};

export default AuthModal;