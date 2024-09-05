import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromcartByID
} from './../../../cartSlice'; 
import { apiCallToAiWithJsonFormat } from './../../../ApiAiCall';
import './Cart.css';

function Cart() {
  const cartItems = useSelector((state) => state.shoppingCart);
  const grandTotal = useSelector((state) => state.grandTotal);
  const dispatch = useDispatch();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromcartByID(id));
  };

  const handleSendToAI = async () => {
    if (prompt.trim()) {
      setLoading(true);
      try {
        await apiCallToAiWithJsonFormat(prompt, dispatch);
        setPrompt(''); 
      } catch (error) {
        console.error('Error:', error); 
      } finally {
        setLoading(false); 
      }
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-items-column">
          <div className="cart-card">
            <div className="cart-total" style={{ textAlign: 'center' }}>
              <h2>Grand Total: ${grandTotal.toFixed(2)}</h2>
            </div>
            {cartItems.length === 0 ? (
              <h3 className="cart-empty">Your cart is empty</h3>
            ) : (
              <div className="cart-items-container">
                <ul className="cart-items-list">
                  {cartItems.map((item) => (
                    <li key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
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
        <div className="cart-form-column">
          <div className="form-card">
            <h3>Write your virtual assistant to make your order</h3>
            <textarea
              className="order-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your order here..."
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <button
                className="submit-button"
                onClick={handleSendToAI}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
              {loading && (
                <div className="spinner-overlay">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
