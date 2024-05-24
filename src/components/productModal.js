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
  Textarea,
  Checkbox, 
  CheckboxGroup,
  Stack
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useAuthContext } from '../context/authContext';
import handleFetch from '../utils/handleFetch'
import FileUploader from './imageUploader';

// this component handles the modal for account related actions
const ProductModal = ({ 
    isOpen, 
    onClose, 
    mode, 
    id, 
    imageSrc, 
    name, 
    price, 
    quantity, 
    forMale, 
    forFemale, 
    description
  }) => {
  const toast = useToast();
  const [isForMale, setIsForMale] = useState(mode === 'modify' ? forMale : true);
  const [isForFemale, setIsForFemale] = useState(mode === 'modify' ? forFemale : true);
  const [productImage, setProductImage] = useState({ 
    file: undefined, 
    preview: (imageSrc ? imageSrc : '') , 
    url: (imageSrc ? imageSrc : '') 
  });
  const { accessToken } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      name: '',
      price: undefined,
      quantity: undefined,
      description: '',
    },
    onSubmit: () => {
      if (mode === 'modify'){
        updateProduct();
      } else {
        postProduct();
      }
    },
    // product name, price, quantity are required
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      quantity: Yup.number().integer().required('Required'),
      description: Yup.string(),
    })
  });

  // action after fetch is successful
  const onAction = ()=> {
    formik.resetForm();
    URL.revokeObjectURL(productImage.preview);
    setProductImage({ file: undefined, preview: '', url: '' });
    onClose();
  };


  
   // Revoke the data uris to avoid memory leaks, will run on unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(productImage.preview);
  }, []);
  

  // fetch for post product
  const postProduct = async () => {
    const url = 'http://localhost:9000/product';
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
    const body = JSON.stringify({ 
      'product_image_link': productImage.url,
      'product_name': formik.values.name, 
      'product_price': formik.values.price,
      'product_quantity': formik.values.quantity,
      'product_for_male': isForMale,
      'product_for_female': isForFemale,
      'product_description': formik.values.description,
    });
    await handleFetch(url, headers, 'POST', body, onAction, toast);
  };

  // set up for product update, read props into formik values for form control
  useEffect(() => {
    mode === 'modify' &&
      formik.setValues({
        ...formik.values,
        name, 
        price, 
        quantity,
        description
      })
  }, [isOpen]);

  // reset image uploader status when modal closes
  useEffect(() => {
      setProductImage({ 
        file: undefined, 
        preview: (imageSrc ? imageSrc : '') , 
        url: (imageSrc ? imageSrc : '') 
      });
    
  }, [isOpen]);

  // fetch for product update
  const updateProduct = async () => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
    const body = JSON.stringify({ 
      'product_id': id,
      'product_image_link': productImage.url,
      'product_name': formik.values.name, 
      'product_description': formik.values.description,
      'product_price': formik.values.price,
      'product_quantity': formik.values.quantity,
      'product_for_male': isForMale,
      'product_for_female': isForFemale,
    });
    await handleFetch('http://localhost:9000/product', headers, 'PUT', body, onAction, toast);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalOverlay />
      <ModalContent>
        
      <form onSubmit ={formik.handleSubmit}>
        <ModalHeader>{mode === 'post' ? 'Add product' : 'Update product'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

          <FileUploader image={productImage} setImage={setProductImage} dirName='product-images' imageType='product' />

          <FormControl isInvalid={formik.touched.name && formik.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              placeholder='Enter product name'
              {...formik.getFieldProps('name')}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <HStack spacing={4}>
            <FormControl mt={4} isInvalid={formik.touched.price && formik.errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                type='number'
                placeholder='Enter price'
                {...formik.getFieldProps('price')}
              />
              <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={formik.touched.quantity && formik.errors.quantity}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type='number'
                placeholder='Enter quantity'
                {...formik.getFieldProps('quantity')}
              />
              <FormErrorMessage>{formik.errors.quantity}</FormErrorMessage>
            </FormControl>
          </HStack>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              type='text'
              placeholder='Enter product description'
              {...formik.getFieldProps('description')}
            />
          </FormControl>

          <FormControl mt={4}>
            <CheckboxGroup colorScheme='green'>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox isChecked={isForMale} onChange={() => setIsForMale(!isForMale)}>Men</Checkbox>
                <Checkbox isChecked={isForFemale} onChange={() => setIsForFemale(!isForFemale)}>Women</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>

        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            <Button type='submit' colorScheme='teal'>Submit</Button>
          </HStack>
        </ModalFooter>
        </form>
      </ModalContent>
      
    </Modal>
  );
};

export default ProductModal;