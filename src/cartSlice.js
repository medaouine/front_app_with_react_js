
import { createSlice } from "@reduxjs/toolkit";
import productList from './productList';


const initialState = {

  loading:false,
  loading_menu:false,

  isLogged: false,
  permissions:{},
  products:[],
  shoppingCart: [],
  grandTotal: 0,
  userPrompt:""
};



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    setIsLoggedinToTrue: (state) => {
      state.isLogged = true;
    },
    setIsLoggedinToFalse: (state) => {
      state.isLogged = false;
    },

    setLoaderToTrue: (state) => {
      state.loading = true;
    },
    setLoaderToFalse: (state) => {
      state.loading = false;
    },
    
    addTocart: (state, action) => { 
      const productToAdd = action.payload;
      const existingProduct = state.shoppingCart.find(item => item.id === productToAdd.id);   
      if (existingProduct) {
     
        existingProduct.quantity += 1;
        existingProduct.totalPrice = existingProduct.price * existingProduct.quantity;
      } else {
    
        const newProduct = {
          ...productToAdd,
          quantity: 1,
          totalPrice: productToAdd.price
        };
        state.shoppingCart.push(newProduct);
      }
      state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);
   
    }, 
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.shoppingCart.find(item => item.id === productId);
      if (product) {
        if (product.quantity < 10) { 
          product.quantity += 1;
          product.totalPrice = product.price * product.quantity;
        }
      }
      state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.shoppingCart.find(item => item.id === productId);
      if (product) {
        if (product.quantity > 1) { 
          product.quantity -= 1;
          product.totalPrice = product.price * product.quantity;
        } 
      }
      state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);
    },
    clearShoppingCart: (state ) => {
  state.shoppingCart = [];
  state.grandTotal = 0;
    },
    removeFromcartByID: (state, action) => {
      let productId = action.payload;
      productId = parseInt(productId, 10); 

             state.shoppingCart = state.shoppingCart.filter( (item) => item.id !== productId);
              state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);

    },
    decreaseQuantityByIdandqty: (state, action) => {


      const productId = action.payload.id;
      let productQty = action.payload.quantity;
      productQty= parseInt(productQty, 10);



   




      const product = state.shoppingCart.find(item => item.id === productId);
      if (product) {
        if (product.quantity >1 ) { 
          product.quantity -= productQty;
          product.totalPrice = product.price * product.quantity;
        } 
      }
      state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);
    },
    addTocartByProductandQtyV2: (state, action) => {
 
      const productId = parseInt(action.payload.product_id, 10); 
      let qty = parseInt(action.payload.quantity, 10);    
      function getProductDetails(product_id) {
        return productList.find(product => product.id === product_id);
      }  
      const productDetails = getProductDetails(productId);
      if (!productDetails) {
        console.log('No Product found');
      } 
    const existingProduct = state.shoppingCart.find(item => item.id === productId);   
      if (existingProduct) { 
        existingProduct.quantity += qty;
        existingProduct.totalPrice = existingProduct.price * existingProduct.quantity;
      } else {
    
        const newProduct = {
          ...productDetails,
          quantity: qty,
          totalPrice: productDetails.price
        };
        state.shoppingCart.push(newProduct);
      }
      state.grandTotal = state.shoppingCart.reduce((acc, item) => acc + item.totalPrice, 0);
    },

  },

});

export const { 

  setIsLoggedinToTrue,
  setIsLoggedinToFalse,
  setLoaderToTrue,
  setLoaderToFalse,
  increaseQuantity, 
  decreaseQuantity,
  decreaseQuantityByIdandqty,
   addTocart, 
   removeFromcart,
   removeFromcartByID,
   addTocartByProductandQtyV2,
   clearShoppingCart
   } = cartSlice.actions;







export default cartSlice.reducer;
















