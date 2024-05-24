import {createContext, useContext, useState} from 'react';

const CartContext = createContext(undefined);

// if user refresh page, state would be lost, to stay login local memory is used
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
