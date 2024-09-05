import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTocart } from './../../../cartSlice'; 
import './Product.css';

function Product() {
  const dispatch = useDispatch();

  const list = [
    { id: 1, name: 'Hamburger', image: 'https://cmx.weightwatchers.com/assets-proxy/weight-watchers/image/upload/v1594406683/visitor-site/prod/ca/burgers_mobile_my18jv', price: 8 },
    { id: 2, name: 'Pizza', image: 'https://th.bing.com/th/id/OIP.3Z4gvi7mZEpin_3jIwLHHgHaE7?w=282&h=187&c=7&r=0&o=5&pid=1.7', price: 7 },
    { id: 3, name: 'Cocacola', image: 'https://i5.walmartimages.com/asr/718749b7-5046-4abe-80ae-12bdc9dd4a77_1.cdfffc5d72a26b604ec5b36acfe443e4.jpeg', price: 2 },
    { id: 4, name: 'Chicken Wrap', image: 'https://www.chicken.ca/wp-content/uploads/2020/09/fresh-wraps.jpg', price: 25 },
    { id: 5, name: 'Lasagna', image: 'https://2.bp.blogspot.com/-wnNED3aVQlM/T2jVCz6tn-I/AAAAAAAABo4/rOvGaxAbAOw/s1600/2012-02-23_18-10-57_648.jpg', price: 12 },
    { id: 6, name: 'Grilled Fish', image: 'https://fthmb.tqn.com/657ezyoe9gpnT7GujFKlxnmKVc4=/2879x1902/filters:fill(auto,1)/GettyImages-95641271-58ad133b5f9b58a3c90f9261.jpg', price: 14 },
    { id: 7, name: 'Grilled Meat', image: 'https://th.bing.com/th/id/R.ad9c5f7b4b4b44aba0f08ce4a347260f?rik=pnRqgIDifxw1kQ&pid=ImgRaw&r=0', price: 16 },
    { id: 8, name: 'Juice', image: 'https://www.marthastewart.com/thmb/v-noUz0Pm9dexdEBhiOKiC-TKhk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/oj-upgrade-103121806_horiz_0-83474c4f9a0b4d7e9c06fc989fa1f5d2.jpgitokHQdK4qxB', price: 7 },
    { id: 9, name: 'Soup', image: 'https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg', price: 5 },
  ];

  const handleAddToCart = (product) => {
    console.log(`Adding product to cart: ${product.id}`);
    dispatch(addTocart(product)); 
  };

  return (
    <div className="product-container">
      {list.map((item) => (
        <div key={item.id} className="product-card">
          <img src={item.image} alt={item.name} className="product-image" />
          <div className="product-details">
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <button className="add-to-cart" onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Product;
