import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileForm from '../components/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Header title="Mi Perfil" />
      <div style={{ padding: '20px' }}>
        <ProfileForm />
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;