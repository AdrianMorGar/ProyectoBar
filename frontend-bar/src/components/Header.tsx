import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center' }}>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;