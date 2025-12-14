import { createSlice } from "@reduxjs/toolkit";

// Initial state of the cart
const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};

// Cart slice that handles shopping cart state and actions
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Add specified amount (add_quantity) of a product to cart
        addToCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item.product_id === action.payload.product_id
                );
            // If the product already exists in the cart, increase its quantity
            if (itemIndex >= 0){
                state.cartItems[itemIndex].cartQuantity += 
                action.payload.add_quantity ?? 1;
            // If the product is not in the cart, add it with an initial quantity
            } else {
                const tempProduct = 
                { ...action.payload, cartQuantity: action.payload.add_quantity ? action.payload.add_quantity : 1 };
                state.cartItems.push(tempProduct);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        // Remove a product altogether
        removeFromCart(state, action) {
            const nextCartItems = state.cartItems.filter(
                cartItems => cartItems.product_id !== action.payload.product_id
            );

            state.cartItems = nextCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        // Remove a product by decrease its quantity by 1
        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item.product_id === action.payload.product_id
                );
            if (state.cartItems[itemIndex].cartQuantity > 1){
                state.cartItems[itemIndex].cartQuantity -= 1;
            } else {
                const nextCartItems = state.cartItems.filter(
                    cartItems => cartItems.product_id !== action.payload.product_id
                );
                state.cartItems = nextCartItems;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart(state) {
            state.cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        getTotals(state) {
            let {total, quantity} = state.cartItems.reduce((cartTotal, cartItem)=>{
                const { product_price, cartQuantity } = cartItem;
                const itemTotal = product_price * cartQuantity;
                cartTotal.total += itemTotal;
                cartTotal.quantity += cartQuantity;
                return cartTotal;
            }, 
            {
                total:0,
                quantity:0,
            });
            state.cartTotalQuantity = quantity;
            state.cartTotalAmount = total;
        }
    },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart, getTotals } = cartSlice.actions;

export default cartSlice.reducer;