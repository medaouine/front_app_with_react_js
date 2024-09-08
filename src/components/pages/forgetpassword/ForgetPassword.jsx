import React from 'react';
import useForgetPassword from '../../../hooks/useForgetPassword'; // Adjust the path as needed
import './ForgetPassword.css';
import { Circles } from 'react-loader-spinner';

function ForgetPassword() {
  const { email, setEmail, handleSubmit, loading } = useForgetPassword();

  return (
    <div className="container">
      {loading ? (
        <div className="overlay">
          <Circles
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <>
          <h1 className="header">Forgot Password</h1>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="email" className="label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="button">Send Reset Link</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgetPassword;