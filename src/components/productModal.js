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
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../context/authContext';
import handleFetch from '../utils/handleFetch'
import FileUploader from './imageUploader';

/*
Product modal component for handling product information(post & update)
Using Formik for form state and Chakra UI for layout
*/

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

  // Reset gender checkbox once modal opens, use existing values if it's modifying an product
  useEffect(() => {
    if (!isOpen) return;
    setIsForMale(mode === 'modify' ? !!forMale : true);
    setIsForFemale(mode === 'modify' ? !!forFemale : true);
  }, [isOpen, mode, forMale, forFemale]);

  // Set up for product update, read props into formik values for form control
  useEffect(() => {
    if (!isOpen) return;
    mode === 'modify' &&
      formik.setValues({
        name: name ?? '',
        price: price ?? '',
        quantity: quantity ?? '',
        description: description ?? '',
      });
  }, [isOpen, mode, name, price, quantity, description]);

  // Reset image uploader status when modal closes
  useEffect(() => {
      setProductImage({ 
        file: undefined, 
        preview: (imageSrc ? imageSrc : '') , 
        url: (imageSrc ? imageSrc : '') 
      });
    
  }, [isOpen, imageSrc]);

  // Helper function to revoke image preview
  const revokeIfBlob = (url) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
  };

  // Clean up after fetch is successful
  const onAction = ()=> {
    formik.resetForm();
    revokeIfBlob(productImage.preview);
    setProductImage({ file: undefined, preview: '', url: '' });
    onClose();
  };


  const uploadToSupabaseIfNeeded = async () => {
  // If user didn't select a new file, keep existing URL (imageSrc / productImage.url)
  if (!productImage.file) return productImage.url || imageSrc || '';

  const file = productImage.file;
  const fileParts = file.name.split('.');
  const ext = fileParts[fileParts.length - 1];
  const base = fileParts.slice(0, -1).join('.') || 'image';
  const fileName = `product-images/${uuidv4()}-${base}.${ext}`;

  const { error } = await supabase.storage
    .from('trade-app-images')
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('trade-app-images')
    .getPublicUrl(fileName);

  return data?.publicUrl || data?.publicURL || '';
};

  // Product creation
  const postProduct = async () => {
    try {
      const imageUrl = await uploadToSupabaseIfNeeded();
      const url = process.env.REACT_APP_API + '/api/v1/product';
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
      const body = JSON.stringify({ 
        'product_image_link': imageUrl,
        'product_name': formik.values.name, 
        'product_price': formik.values.price,
        'product_quantity': formik.values.quantity,
        'product_for_male': isForMale,
        'product_for_female': isForFemale,
        'product_description': formik.values.description,
      });
      await handleFetch(url, headers, 'POST', body, onAction, toast);
    }
    catch (e) {
      console.log(e);
    }
    
  };


  // Product update
  const updateProduct = async () => {
    try {
      const imageUrl = await uploadToSupabaseIfNeeded();
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken };
      const body = JSON.stringify({ 
        'product_id': id,
        'product_image_link': imageUrl,
        'product_name': formik.values.name, 
        'product_description': formik.values.description,
        'product_price': formik.values.price,
        'product_quantity': formik.values.quantity,
        'product_for_male': isForMale,
        'product_for_female': isForFemale,
      });
      await handleFetch(process.env.REACT_APP_API + `/api/v1/product/${id}`, headers, 'PUT', body, onAction, toast);
      }
    catch (e) {
      console.log(e);
    }
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