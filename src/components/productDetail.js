import { useState, useEffect } from "react";
import { Box, HStack, Heading, VStack, Image, Button, Spacer } from "@chakra-ui/react";
import { useCartContext } from "../context/cartContext";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, getTotals } from "../features/cartSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import "./productDetail.css";

// Product detail page component
const ProductDetail = () => {
    const [count, setCount] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const product = localStorage.getItem('product') ?  JSON.parse(localStorage.getItem('product')) : null;
    const { onOpenCart } = useCartContext();
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart.cartItems, dispatch])
    
    //If product is not found in local memory display the issue
    if (!product) return <Box mt={150}>Product not found.</Box>;
    

    const handleAddToCart = (cartItem) => {
        dispatch(addToCart({...cartItem, add_quantity: count}));
        onOpenCart();
    }

    // Toggle check box
    const handleAccordionClick = (id) => {
        setActiveAccordion((prev) => (prev === id ? null : id));
    };

    // Set a limit of maximum 999 for add quantity per item
    const increaseCount = () => setCount((c) => Math.min(999, c + 1));

    // Set a limit of minium 1 for add quantity per item
    const decreaseCount = () => setCount((c) => Math.max(1, c - 1));

    

    return (
        <Box mt={150} mb={75} w='60%' alignSelf={'center'}>
            <HStack w='100%' gap={10} alignItems={'initial'}>
                <Image 
                    w='70%'
                    height='600px'
                    src={product.product_image_link} 
                    padding='20px' 
                    border='1px solid black'
                />
                <VStack w='40%' h='auto' align='start' gap={1}>
                    <Heading mb={0}>{product.product_name} </Heading>
                    <p>SKU: {product.product_id}</p>
                    <p style={{fontSize:'20px'}}>${product.product_price}</p>
                    <p style={{marginBottom:'0'}}> Quantity</p>
                    <HStack mb={10} justify='center' 
                        style={{padding:'3px', border:'1px solid black', borderRadius:'5px'}}
                    >
                        <button
                            onClick={decreaseCount}
                        >
                            -
                        </button>
                        <div>{count}</div>
                        <button 
                            onClick={increaseCount}
                        >
                            +
                        </button>
                    </HStack>
                    <Button onClick={() => handleAddToCart(product)} w='100%' mb={2} colorScheme={'teal'}>Add to Cart</Button>
                    <Button w='100%' h='40px' mb={10} colorScheme={'teal'}>Buy Now</Button>
                    <ul className='accordion'>
                        <li onClick={() => handleAccordionClick('productInfo')}>
                            <HStack>
                                <label htmlFor='productInfo'>PRODUCT INFO</label>
                                <Spacer></Spacer>
                                {activeAccordion !== 'productInfo' ?
                                <FontAwesomeIcon 
                                    icon={ faPlus }
                                    size='1x' 
                                />
                                :
                                <FontAwesomeIcon 
                                    icon={ faMinus }
                                    size='1x' 
                                />}
                            </HStack>
                            <div className={activeAccordion === 'productInfo' ? 'active' : 'inactive'}>
                                <p>{product.product_description}</p>
                            </div>
                        </li>
                        <li onClick={() => handleAccordionClick('returnPolicy')}>
                            <HStack>
                                <label htmlFor='returnPolicy'>RETURN & REFUND POLICY</label>
                                <Spacer></Spacer>
                                {activeAccordion !== 'returnPolicy' ?
                                <FontAwesomeIcon 
                                    icon={ faPlus }
                                    size='1x' 
                                />
                                :
                                <FontAwesomeIcon 
                                    icon={ faMinus }
                                    size='1x' 
                                />}
                            </HStack>
                            <div className={activeAccordion === 'returnPolicy' ? 'active' : 'inactive'}>
                                <p>
                                    I’m a Return and Refund policy. I’m a great place to let your customers know what to do in case they are dissatisfied
                                    with their purchase. Having a straightforward refund or exchange policy is a great way to build trust and reassure
                                    your customers that they can buy with confidence.
                                </p>
                            </div>
                        </li>
                        <li onClick={() => handleAccordionClick('shippingInfo')}>
                            <HStack>
                                <label htmlFor='shippingInfo'>SHIPPING INFO</label>
                                <Spacer></Spacer>
                                {activeAccordion !== 'shippingInfo' ?
                                <FontAwesomeIcon 
                                    icon={ faPlus }
                                    size='1x' 
                                />
                                :
                                <FontAwesomeIcon 
                                    icon={ faMinus }
                                    size='1x' 
                                />}
                            </HStack>
                            <div className={activeAccordion === 'shippingInfo' ? 'active' : 'inactive'}>
                                <p>
                                    I'm a shipping policy. I'm a great place to add more information about your shipping methods, packaging and cost. 
                                    Providing straightforward information about your shipping policy is a great way to build trust and reassure your customers 
                                    that they can buy from you with confidence.
                                </p>
                            </div>
                        </li>
                    </ul>
                </VStack>
            </HStack>
        </Box>
    )
}

export default ProductDetail;