import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {
  decreaseQuantityByIdandqty,
  removeFromcartByID,
  addTocartByProductandQtyV2,
  setLoaderToTrue,
  setLoaderToFalse,
  clearShoppingCart
} from './cartSlice';


const openAiUrl = import.meta.env.VITE_OPENAI_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const handleFunctionCallByJsonFormat = (jsonArray, dispatch) => {
  try {
    jsonArray.forEach(item => {
    
      const { function_name, arguments: { id, quantity } } = item;

    
      const functionNameStr = String(function_name);
      const quantityStr = String(quantity);
     
      

      switch (functionNameStr) {
        case "1":
   
           dispatch(addTocartByProductandQtyV2({ product_id: id, quantity: quantity }));
          break;
        case "2":
    
           dispatch(decreaseQuantityByIdandqty({ id: id, quantity: quantityStr}));
          break;
        case "3":
 
           dispatch(removeFromcartByID(id));
          break;
        case "4":
;
         dispatch(clearShoppingCart());
         
          break;    
        default:
          console.log (`Unknown function_name: ${functionNameStr}`);
      }
    });
  } catch (error) {
    console.log("Error handling function call:", error);
  }
};


export const apiCallToAiWithJsonFormat = async (prompt, dispatch) => {



 console.log("============================ apiCallToAiWithJsonFormat started  ======================");
  try {
    dispatch(setLoaderToTrue());

    const response = await axios.post(
      openAiUrl,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant designed to answer exclusively and strictly and always and all the time with no exception with 100 percent json format. The JSON response should be structured always and all the time and exclusively and 100 percent as follows:
            [
                {
                  "function_name": // Must be one of the following numbers : 1 (Adding a product to the shopping cart ), 2 ( Decreasing the quantity of a product in the shopping list ), 3 (Removing a product from the shopping list ), 4 (Resetting the whole shopping cart  to empty) 
                  "arguments": {
                    "id": // Must be one of the following IDs: 1 (Hamburger), 2 (Pizza), 3 (Cocacola), 4 (Chicken Wrap), 5 (Lasagna), 6 (Grilled Fish), 7 (Grilled Meat), 8 (Cheese Cake)
                    "quantity": // the quantity of the product 
                  }
                }
            ]`
          },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );



    let json = response.data.choices[0].message.content;
    const jsonMatch = json.match(/\[.*\]/s);
    if (jsonMatch) {
      json = jsonMatch[0];
    }

    try {
      const parsedArgs = JSON.parse(json);
      console.log("Parsed JSON:", parsedArgs);
      handleFunctionCallByJsonFormat(parsedArgs, dispatch);
    } catch (parseError) {
      console.error('JSON Parse error:', parseError.message);
      console.error('Raw JSON response:', json);
    }

    dispatch(setLoaderToFalse());
  } catch (error) {
    dispatch(setLoaderToFalse());
    console.error('API call error:', error.message);
  }
};

