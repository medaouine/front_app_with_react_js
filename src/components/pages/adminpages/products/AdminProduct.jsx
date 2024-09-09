import React, { useEffect, useState } from 'react';
import useApi from '../../../../hooks/useApi';
import './AdminProduct.css';
import { Circles } from 'react-loader-spinner';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct } from './../../../../cartSlice';
import placeholderImage from '../../../../assets/placeholder.jpg';

Modal.setAppElement('#root');

function AdminProduct() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.products);
  const isLoading = useSelector((state) => state.products.loading);
  const { axiosInstance } = useApi();
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formMode, setFormMode] = useState('VIEW'); // 'VIEW', 'ADD', 'EDIT'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
    imageURL: ''
  });

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('products');
      dispatch(addProduct(response.data));
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this product!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/products/${id}`);
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        getProducts(); // Refresh products list
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
    }
  };

  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
      imageURL: product.image ? `http://localhost:3000${product.image}` : ''
    });
    setFormMode('EDIT');
    setModalIsOpen(true);
  };

  const handleView = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
      imageURL: product.image ? `http://localhost:3000${product.image}` : ''
    });
    setFormMode('VIEW');
    setModalIsOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      image: null,
      imageURL: ''
    });
    setFormMode('ADD');
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file,
      imageURL: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('quantity', formData.quantity);
    if (formData.image) {
      form.append('image', formData.image);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      if (formMode === 'EDIT') {
        await axiosInstance.put(`/products/${currentProduct.id}`, form, config);
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        await axiosInstance.post('/addproduct', form, config);
        Swal.fire({
          title: 'Success!',
          text: 'Product added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      handleModalClose();
      getProducts(); // Refresh products list
    } catch (error) {
      console.log('Error saving product:', error);
      Swal.fire('Error!', 'There was a problem saving the product.', 'error');
    }
  };

  return (
    <div className="admin-product-container">
      {isLoading ? (
        <div className="loader">
          <Circles
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className="product-cards">
          <button className="add-product-button" onClick={handleAdd}>Add Product</button>
          {products.length === 0 ? (
            <p className="no-products-message">No products found</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image ? `http://localhost:3000${product.image}` :  placeholderImage}
                  alt={product.name}
                  className="product-image"
                />
                <h4 className="product-info">Name: {product.name}</h4>
                <h5 className="product-info">Price: {product.price} $</h5>
                <div className="product-actions">
                  <button className="view-button" onClick={() => handleView(product)}>View</button>
                  <button className="update-button" onClick={() => handleUpdate(product)}>Update</button>
                  <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        contentLabel={formMode === 'VIEW' ? "View Product" : formMode === 'EDIT' ? "Update Product" : "Add Product"}
        className="modal"
        overlayClassName="overlay"
      >
        {formMode === 'VIEW' && (
          <div className="admin_view">
            {formData.imageURL ? (
              <img src={formData.imageURL} alt="Product" className="admin_image-thumbnail" />
            ) : (
              <div className="admin_image-placeholder">No Image</div>
            )}
            <div className="admin_content">
              <p className="admin_form-data">
                <span className="admin_label-text">Name:</span> <strong>{formData.name}</strong>
              </p>
              <p className="admin_form-data">
                <span className="admin_label-text">Description:</span> <strong>{formData.description}</strong>
              </p>
              <p className="admin_form-data">
                <span className="admin_label-text">Quantity:</span> <strong>{formData.quantity}</strong>
              </p>
              <button type="button" className="admin_ok-button" onClick={handleModalClose}>OK</button>
            </div>
          </div>
        )}

        {(formMode === 'EDIT' || formMode === 'ADD') && (
          <form onSubmit={handleSubmit} className="admin_modal-body">
            <div className="admin_input-row">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="admin_input-field"
                />
              </label>
            </div>
            <div className="admin_input-row">
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="admin_input-field"
                />
              </label>
            </div>
            <div className="admin_input-row">
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="admin_input-field"
                />
              </label>
            </div>
            <div className="admin_input-row">
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="admin_input-field"
                />
              </label>
            </div>
            <div className="admin_input-row">
              <label>
                <div className="admin_image-preview">
                  {formData.imageURL ? (
                    <img src={formData.imageURL} alt="Product" className="admin_image-thumbnail" />
                  ) : (
                    <div className="admin_image-placeholder">No Image</div>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </label>
            </div>
            <div className="admin_modal-footer">
              <button type="button" className="admin_edit-image-button" onClick={() => document.getElementById('file-input').click()}>
                {formData.imageURL ? 'Edit Image' : 'Add Image'}
              </button>
              {formData.imageURL && (
                <button type="button" className="admin_delete-image-button" onClick={() => setFormData(prev => ({
                  ...prev,
                  image: null,
                  imageURL: ''
                }))}>
                  Delete Image
                </button>
              )}
              <button type="submit" className="admin_confirm-button">
                {formMode === 'EDIT' ? 'Update' : 'Add'}
              </button>
              <button type="button" className="admin_cancel-button" onClick={handleModalClose}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AdminProduct;
