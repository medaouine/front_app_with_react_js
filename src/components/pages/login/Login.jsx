import React from 'react';
import useLogin from '../../../hooks/useLogin';
import './login.css';
import { Circles } from 'react-loader-spinner';

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    loading,
    error,
  } = useLogin();

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Login</h2>

        {error && <div className="login-alert">{error}</div>}

        {loading ? (
          <div className="loader-overlay">
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
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <div className="login-footer">
          <button
            type="button"
            className="login-link"
            onClick={() => window.location.href = '/forgetpassword'}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
