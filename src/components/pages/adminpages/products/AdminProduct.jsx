import React, { useEffect, useState } from 'react';
import useApi from '../../../../hooks/useApi';
import './AdminProduct.css';
import { Circles } from 'react-loader-spinner';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct } from './../../../../cartSlice';

Modal.setAppElement('#root');

function AdminProduct() {



  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.products);
  const isLoading = useSelector((state) => state.products.loading);
  const { axiosInstance } = useApi();
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
      console.log('Redux products ==:', cartItems);
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
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
    }
  };




  const FormMode = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    VIEW: 'VIEW'
  };
  const [formMode, setFormMode] = useState(FormMode.VIEW);
  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
      imageURL: `http://localhost:3000${product.image}`
    });
    setFormMode(FormMode.EDIT);
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
      imageURL: `http://localhost:3000${product.image}`
    });
    setFormMode(FormMode.VIEW);
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
    setFormMode(FormMode.ADD);
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
      if (isEditMode) {
        const response = await axiosInstance.put(`/products/${currentProduct.id}`, form, config);
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        const response = await axiosInstance.post('/addproduct', form, config);
        Swal.fire({
          title: 'Success!',
          text: 'Product added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      handleModalClose();
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
          {cartItems.length === 0 ? (
            <p className="no-products-message">No products found</p>
          ) : (
            cartItems.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={`http://localhost:3000${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
           
                    <h4 class="product-info" > Name : {product.name}</h4>
                    <h5 class="product-info" > Price : {product.price} $</h5>


                

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
  contentLabel={
    formMode === FormMode.VIEW
      ? "View Product"
      : formMode === FormMode.EDIT
      ? "Update Product"
      : formMode === FormMode.ADD
      ? "Add Product"
      : "Modal"
  }
  className="modal"
  overlayClassName="overlay"
>
  {formMode === FormMode.VIEW && (
    <div className="view-content">
      {formData.imageURL && (
        <img src={formData.imageURL} alt="Product" className="image-thumbnail" />
      )}
      <p className="form-data">
        <span className="label-text">Name:</span> {formData.name}
      </p>
      <p className="form-data">
        <span className="label-text">Description:</span> {formData.description}
      </p>
      <p className="form-data">
        <span className="label-text">Quantity:</span> {formData.quantity}
      </p>
      <button type="button" className="ok-button" onClick={handleModalClose}>OK</button>
    </div>
  )}
  {formMode === FormMode.EDIT && (
    <form onSubmit={handleSubmit} className="modal-body">
      <div className="input-row">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Image:
          <div className="image-preview">
            {formData.imageURL ? (
              <img src={formData.imageURL} alt="Product" className="image-thumbnail" />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}
            <button
              type="button"
              className="edit-image-button"
              onClick={() => document.getElementById('file-input').click()}
            >
              {formData.imageURL ? 'Edit Image' : 'Add Image'}
            </button>
            {formData.imageURL && (
              <button
                type="button"
                className="delete-image-button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  image: null,
                  imageURL: ''
                }))}
              >
                Delete Image
              </button>
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
      <div className="modal-footer">
        <button type="submit" className="confirm-button">
          {formMode === FormMode.EDIT ? 'Update' : 'Add'}
        </button>
        <button type="button" className="cancel-button" onClick={handleModalClose}>Cancel</button>
      </div>
    </form>
  )}
  {formMode === FormMode.ADD && (
    <form onSubmit={handleSubmit} className="modal-body">
      <div className="input-row">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="input-row">
        <label>
          Image:
          <div className="image-preview">
            {!formData.imageURL && (
              <div className="image-placeholder">No Image</div>
            )}
            <button
              type="button"
              className="edit-image-button"
              onClick={() => document.getElementById('file-input').click()}
            >
              {formData.imageURL ? 'Edit Image' : 'Add Image'}
            </button>
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
      <div className="modal-footer">
        <button type="submit" className="confirm-button">
          {formMode === FormMode.EDIT ? 'Update' : 'Add'}
        </button>
        <button type="button" className="cancel-button" onClick={handleModalClose}>Cancel</button>
      </div>
    </form>
  )}
</Modal>















      <Modal
     
        onRequestClose={handleModalClose}
        contentLabel={isEditMode ? "Update Product" : "Add Product"}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h2>{isEditMode ? 'Update Product' : 'Add Product'}</h2>
          <button className="close-button" onClick={handleModalClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-row">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="input-row">
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="input-row">
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="input-row">
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="input-row">
            <label>
              Image:
              <div className="image-preview">
                {formData.imageURL && (
                  <img src={formData.imageURL} alt="Product" className="image-thumbnail" />
                )}
                <button
                  type="button"
                  className="edit-image-button"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  Edit Image
                </button>
                <button
                  type="button"
                  className="delete-image-button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    image: null,
                    imageURL: ''
                  }))}
                >
                  Delete Image
                </button>
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
          <div className="modal-footer">
            <button type="submit" className="confirm-button">{isEditMode ? 'Update' : 'Add'}</button>
            <button type="button" className="cancel-button" onClick={handleModalClose}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminProduct;
