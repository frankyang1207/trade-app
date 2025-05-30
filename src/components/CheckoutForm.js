import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from "react-redux";
import { useAuthContext } from '../context/authContext';

const stripePromise = loadStripe("pk_test_51IvlrEKiKjECHoUbZQldbFxix1UFV1QKgPjUGa3DrvMbMLgMCVhiyMALR3yXMicX92vCn1BCbiAg9REskTBrWdhj00mpyAjeos");

const CheckoutForm = ({changePage}) => {
  const cart = useSelector((state) => state.cart);
  
  const { userId } = useAuthContext();
  const [isComplete, setIsComplete] = useState(false);
  const [response, setResponse] = useState('');

  const handleComplete = () => {
    setIsComplete(true);
    changePage('checkoutReturnPage');
  }

  useEffect(() => {
    localStorage.setItem('session-id', response.sessionId);
  }, [response])
  
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("https://trade-app-api-ptxs.onrender.com//create-checkout-session", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({cartItems:cart.cartItems, userId: userId,})
    })
      .then((res) => res.json())
      .then((data) => { 
        setResponse(data);
        return data.clientSecret; 
      });
  }, []);

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