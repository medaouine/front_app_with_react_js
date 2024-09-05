import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromcartByID
} from './../../../cartSlice'; 
import './Cart.css';

function Cart() {
  const cartItems = useSelector((state) => state.shoppingCart);
  const grandTotal = useSelector((state) => state.grandTotal);
  const dispatch = useDispatch();

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromcartByID(id));
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-card">
          <div className="cart-total">
            <h2>Grand Total: ${grandTotal.toFixed(2)}</h2>
          </div>
          {cartItems.length === 0 ? (
            <h3 className="cart-empty">Your cart is empty</h3>
          ) : (
            <div className="cart-items-container">
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={`http://localhost:3000${item.image}`} 
                         alt={item.name} 
                         className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price.toFixed(2)}</p>
                      <p>Total: ${item.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => handleDecrease(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id)}>+</button>
                      <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
