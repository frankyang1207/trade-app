import React, { useCallback, useState } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useSelector } from "react-redux";
import { useAuthContext } from '../context/authContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/*
Checkout form component
Using Stripe for the payment handling
*/
const CheckoutForm = ({changePage}) => {
  const cart = useSelector((state) => state.cart);
  
  const { accessToken } = useAuthContext();
  const [isComplete, setIsComplete] = useState(false);

  // redirect to return page once checkout transaction completes
  const handleComplete = () => {
    setIsComplete(true);
    changePage('checkoutReturnPage');
  }
  
  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          cartItems: cart.cartItems.map(({ product_id, cartQuantity }) => ({
            product_id,
            cartQuantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const data = await res.json();
      // Store Stripe session ID for return page
      if (data?.sessionId) {
        localStorage.setItem('session-id', data.sessionId);
      }
      return data.clientSecret;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }, [cart.cartItems, accessToken]);

  const options = {fetchClientSecret};

  return isComplete ? (
    // <PurchaseSummary />
    <><div style={{marginTop:'140px'}}>payment completed</div></>
  ) : (
    <div style={{margin:'130px 0 40px 0'}}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          ...options,
          onComplete: handleComplete
        }}
      >
        <EmbeddedCheckout/>
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm;
