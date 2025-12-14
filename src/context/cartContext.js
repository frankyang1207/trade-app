import {createContext, useContext, useState} from 'react';

// CartContext to manage shopping cart's visibility
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const productData = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : '';
  const [state, setState] = useState({
     isOpen: false
  });

  return (
    <CartContext.Provider
      value={{
        state,
        ...state,
        onOpenCart: () => setState({
          isOpen: true
        }),
        onCloseCart: () => {
          setState({ 
            isOpen: false 
        })}
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
