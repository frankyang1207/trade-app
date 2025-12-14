import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
    Heading,
    Flex,
    HStack,
    VStack,
    Image,
    Text,
    Button
 } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { removeFromCart, decreaseCart, addToCart, getTotals } from "../features/cartSlice";
import { useAuthContext } from '../context/authContext';


//Shopping cart page component
const Cart = ({ changePage, setLoginModalOpen }) => {
    const { isLoggedin } = useAuthContext();
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // Recalculate subtotal/total whenever cart changes
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch])

    // Remove an item completely from the cart
    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem));
    }

    // Decrease quantity by 1
    const handleDecreaseCart = (cartItem) => {
        dispatch(decreaseCart(cartItem));
    }

    // Increase quantity by 1
    const handleIncreaseCart = (cartItem) => {
        dispatch(addToCart(cartItem));
    }

    // Open auth modal when user tries to checkout while logged out
    const openLoginModal = () => setLoginModalOpen(true);

    return (
        <VStack paddingTop='140px' marginBottom='30px'>
            <HStack w='65%'  align='start'  spacing={10} >
                <VStack w='68%' align='start'>
                    <div style={{width:'100%', borderBottom:'1px solid black' }}>
                        <Heading as="h1" color='black' style={{textAlign:'left'}}>
                            My Cart
                        </Heading>
                    </div>

                    {cart.cartItems?.map(cartItem => (
                        <HStack key={cartItem.product_id} align='start' w='100%' 
                            style={{padding:'10px 10px 20px 10px', borderBottom:'1px solid black'}}
                            >
                            <HStack  w='90%' align='start'>
                                <HStack w='50%'>
                                    <Image 
                                        src={cartItem.product_image_link} 
                                        alt={cartItem.product_name} 
                                        height='120px' 
                                        width='110px'
                                        style={{marginRight:'20px'}}
                                    />
                                    <VStack w='50%' align='start'>
                                        <h6>{cartItem.product_name}</h6>
                                        <p style={{marginBottom:0}}>${cartItem.product_price}</p>
                                        <p>size: medium</p>
                                    </VStack>
                                </HStack>
                                <HStack w='50%' align='stretch' justify='space-evenly'>
                                    <HStack justify='center' 
                                        style={{width: '60px',border:'1px solid black', borderRadius:'5px'}}
                                    >
                                        <button
                                            onClick={() => handleDecreaseCart(cartItem)}
                                        >
                                            -
                                        </button>
                                        <div className="count">{cartItem.cartQuantity}</div>
                                        <button 
                                            onClick={() => handleIncreaseCart(cartItem)}
                                        >
                                            +
                                        </button>
                                    </HStack>
                                    <div className="cart-product-total-price" style={{marginLeft:'30px'}}>
                                        ${Math.round(cartItem.product_price * cartItem.cartQuantity*100)/100}
                                    </div>
                                </HStack>
                            </HStack>
                            <FontAwesomeIcon 
                                onClick={() => handleRemoveFromCart(cartItem)} 
                                style={{cursor: 'pointer', marginTop: 5, marginLeft:'auto'}} 
                                icon={ faXmark }  
                            />
                        </HStack>
                    ))}
                </VStack>
                <VStack w='32%'>
                    <div style={{width:'100%', borderBottom:'1px solid black'}}>
                        <Heading as="h1" color='black' style={{textAlign:'left'}}>
                            Order Summary
                        </Heading>
                    </div>
                    <Flex w='100%' justify='space-between'>
                        <Text>Subtotal</Text>
                        <Text>${Math.round(cart.cartTotalAmount * 100)/100}</Text>
                    </Flex>
                    <p>Taxes and shipping calculated at checkout</p>
                    {
                        isLoggedin ?
                        (<Button w='100%' colorScheme={'teal'}  onClick={() => changePage('checkoutFormPage')}>Checkout</Button>):
                        (<Button w='100%' colorScheme={'teal'} onClick={openLoginModal}>Login to Checkout</Button>)
                    }
                </VStack>
            </HStack>
        </VStack>
    );
}

export default Cart;