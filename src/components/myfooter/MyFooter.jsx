import React from 'react';
import './MyFooter.css';

function MyFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Demo Company. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default MyFooter;
