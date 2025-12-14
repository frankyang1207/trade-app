import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { productsApi } from './features/productsApi';
import cartReducer from './features/cartSlice';

import Header from './components/header';
import ProductsSection from './components/productSection';
import ProductDetail from './components/productDetail';
import { AuthProvider } from './context/authContext';
import Footer from './components/footer';
import UserProfile from './components/userProfile'; 
import ProfileForm from './components/profileForm';
import Cart from './components/cart';
import { getTotals } from './features/cartSlice';
import SideCart from './components/sideCart';
import { CartProvider } from './context/cartContext';
import AuthModal from './components/authModal';
import ProductModal from './components/productModal';
import CheckoutForm from './components/CheckoutForm';
import CheckoutReturn from './components/checkoutReturn';

// Register redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer, 
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(productsApi.middleware)
})

store.dispatch(getTotals())

// Main app component that controls different page and modal views
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  //  Rerender product component when product section changed
  const [refreshProductSection, setRefreshProductSection] = useState(false);
  const [currentPage, setCurrentPage] = useState('landingPage');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false)

  // State to refresh list of products
  const reRenderProducts = () => {
    setRefreshProductSection(prevState => !prevState);
  };

  // Render the component based on currentPage string
  const renderSwitch = (page) => {
    switch (page) {
      case 'userProfilePage':
        return <UserProfile changePage={setCurrentPage}/>;
      case 'profileFormPage':
        return <ProfileForm changePage={setCurrentPage}/>;
      case 'cartPage':
        return <Cart changePage={setCurrentPage} setLoginModalOpen={setLoginModalOpen}/>;
      case 'productDetailPage':
        return <ProductDetail/>;
      case 'checkoutFormPage':
        return <CheckoutForm changePage={setCurrentPage}/>;
      case 'checkoutReturnPage':
        return <CheckoutReturn changePage={setCurrentPage}/>;
      default:
        return <ProductsSection 
          refreshSwitch={refreshProductSection} 
          reRenderProducts={reRenderProducts}
          changePage={setCurrentPage}
          />;
    }
  }

  // Toggle for side cart
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Toggle for product upload modal
  const closePostModal = () => {
    setPostModalOpen(false); 
    // Update app.js and its children
    reRenderProducts();
  }


  return (
    <div className='App' style={{display:'flex', flexDirection:'column', minHeight:'100vh'}} >
      <ChakraProvider>
        <AuthProvider>
          <CartProvider>
            <Provider store={store}>
              <Header
                changePage={setCurrentPage} 
                toggleCart={toggleCart}
                setLoginModalOpen={setLoginModalOpen}
                setRegisterModalOpen={setRegisterModalOpen}
                setPostModalOpen={setPostModalOpen}
              />
              <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} changePage={setCurrentPage} marginTop='300px'/>
              {renderSwitch(currentPage)}
              <Footer />
              <AuthModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} authMode='login' />
              <AuthModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} authMode='register' />
              <ProductModal isOpen={isPostModalOpen} onClose={closePostModal} mode='post'/>
            </Provider>
          </CartProvider>
        </AuthProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
