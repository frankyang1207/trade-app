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
  useToast, 
  Textarea 
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useAuthContext } from '../context/authContext';
import handleFetch from '../utils/handleFetch'

// this component handles the modal for account related actions
const ProductModal = ({ isOpen, onClose, mode, id, name, price, description }) => {
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const { accessToken } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: undefined
    },
    onSubmit: () => {
      setIsFetching(true);
    },
    // only product name and price are required
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string(),
      price: Yup.number().required('Required')
    })
  });

  // action after fetch is successful
  const onAction = ()=> {
    formik.resetForm();
    onClose();
  };

  // fetch for post product
  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:9000/product';
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
      const body = JSON.stringify({ 
        'product_name': formik.values.name, 
        'product_description': formik.values.description,
        'product_price': formik.values.price
      });
      await handleFetch(url, headers, 'POST', body, onAction, toast);
    };

    if (isFetching && mode === 'post') {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching]);

  // set up for product update
  useEffect(() => {
    mode === 'modify' &&
      formik.setValues({
        ...formik.values,
        name, 
        price, 
        description
      });
    
  }, [isOpen]);

  // fetch for product update
  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
      const body = JSON.stringify({ 
        'product_id': id,
        'product_name': formik.values.name, 
        'product_description': formik.values.description,
        'product_price': formik.values.price
      });
      await handleFetch('http://localhost:9000/product', headers, 'PUT', body, onAction, toast);
    };

    if (isFetching && mode === 'modify') {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalOverlay />
      <ModalContent>
        
      <form onSubmit ={formik.handleSubmit}>
        <ModalHeader>{mode === 'post' ? 'Add product' : 'Edit product'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={formik.touched.name && formik.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              placeholder='Enter your product name'
              {...formik.getFieldProps('name')}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={formik.touched.price && formik.errors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type='number'
              placeholder='Enter your product price'
              {...formik.getFieldProps('price')}
            />
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              type='text'
              placeholder='Enter your product description'
              {...formik.getFieldProps('description')}
            />
          </FormControl>
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

export default ProductModal;