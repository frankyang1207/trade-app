import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { HStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cartSlice";

const CheckoutReturn = ({changePage}) => {
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionId = localStorage.getItem('session-id');
    fetch(`http://localhost:9000/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStatus(data.status);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (status === 'open') {
      changePage('checkoutFormPage');
    }
    if (status === 'complete') {
      localStorage.removeItem('cartItems');
      dispatch(clearCart());
    }
  }, [status, dispatch, changePage]);


  if (status === 'complete') {
    localStorage.removeItem('cartItems');
    return (
      <section style={{marginTop:'160px'}}>
        <h1 style={{fontSize:'56px'}}>
          Thank you.
        </h1>
        <h3>
          You order was completed successfully.
        </h3>
        <HStack w='600px' alignContent='center' m='60px auto 30px' spacing={8}>
        <FontAwesomeIcon 
          icon={ faTruckFast } 
          color='teal'
          size='3x'
        />
        <p>
          An email receipt including the details about your purchase has been sent to the email address provided.
          Please keep it for your records.
        </p>
        </HStack>
        <p 
          onClick={() => changePage('productsSectionPage')}
          style={{color:'teal', cursor:'pointer'}}
        >
          continue shopping
        </p>
      </section>
    )
  }

  return null;
}
export default CheckoutReturn;