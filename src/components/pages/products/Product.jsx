import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, addTocart } from './../../../cartSlice'; 
import './Product.css';
import useApi from '../../../hooks/useApi';
import { Circles } from 'react-loader-spinner';

function Product() {

  const { axiosInstance, error } = useApi();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.products);
  const isLoading = useSelector((state) => state.products.loading); 

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('products');
      dispatch(addProduct(response.data)); 
      console.log('Redux products ==:',cartItems);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleAddToCart = (product) => {
    console.log(`Adding product to cart: ${product.id}`);

    console.log(`Adding product to cart: ${product}`);

    const productParsed ={
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    };

   dispatch(addTocart(productParsed)); 
  };

  return (
    <div className="user_productc_container">
      {isLoading ? (
        <div className="user_loader-container">
          <Circles
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : cartItems.length === 0 ? (
        <p className="user_no-products-message">No products Found</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="user_product-card">
            <img 
              src={`http://localhost:3000${item.image}`} 
              alt={item.name} 
              className="user_product-image" 
            />
            <div className="user_product-details">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <button className="user_add-to-cart" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Product;
