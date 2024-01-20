import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'

import Header from './components/header';
import ProductsSection from './components/productSection';
import { AuthProvider } from './context/authContext';
import Footer from './components/Footer';


function App() {
  const [refreshProductSection, setRefreshProductSection] = useState(false);

  const handleAddProduct = () => {
    setRefreshProductSection(prevState => !prevState);
  };

  return (
    <div className='App'>
      <ChakraProvider>
        <AuthProvider>
          <Header onAddProduct={handleAddProduct} />
          <ProductsSection state={refreshProductSection} onUpdateProduct={handleAddProduct} />
          <Footer />
        </AuthProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
