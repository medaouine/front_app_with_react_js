import React from 'react';
import useResetPassword from '../../../hooks/useResetPassword'; 
import { Circles } from 'react-loader-spinner'; 
import './ResetPassword.css'; 



function ResetPassword() {
  const { newPassword, setNewPassword, confirmPassword, setConfirmPassword, handleSubmit, loading } = useResetPassword();

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
          <h1 className="header">Reset Password</h1>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="newPassword" className="label">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input"
            />
            <label htmlFor="confirmPassword" className="label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="button">Reset Password</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ResetPassword;
