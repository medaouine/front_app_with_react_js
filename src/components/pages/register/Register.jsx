import React from 'react';
import useRegister from '../../../hooks/useRegister';
import './register.css';
import { Circles } from 'react-loader-spinner';

const Register = () => {
  const {
    formState,
    handleChange,
    handleSubmit,
    loading,
  } = useRegister();

  const { name, email, password, confirmPassword, error, success } = formState;

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-heading">Register</h2>
        
        {error && <div className="register-alert error">{error}</div>}
        {success && <div className="register-alert success">{success}</div>}
        
        {loading ? (
          <div className="loader-overlay">
            <Circles
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="circles-loading"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
