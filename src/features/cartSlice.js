import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item.product_id === action.payload.product_id
                );
            if (itemIndex >= 0){
                state.cartItems[itemIndex].cartQuantity += 
                action.payload.product_quantity ? action.payload.add_quantity : 1;
            } else {
                const tempProduct = 
                { ...action.payload, cartQuantity: action.payload.add_quantity ? action.payload.add_quantity : 1 };
                state.cartItems.push(tempProduct);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            const nextCartItems = state.cartItems.filter(
                cartItems => cartItems.product_id !== action.payload.product_id
            );

            state.cartItems = nextCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
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
        clearCart(state, action) {
            state.cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        getTotals(state, action) {
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