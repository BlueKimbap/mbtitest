import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  const navigate = useNavigate();

  return (
    <div className="navigation-bar">
      <img 
        src="/로고.png" 
        alt="홈으로" 
        className="home-logo"
        onClick={() => navigate('/')}
      />
    </div>
  );
}

export default NavigationBar; 