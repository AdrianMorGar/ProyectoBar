import React, { useState, useEffect } from 'react';
import { fetchUserById, updateUser, changePassword } from '../api';

const UserProfile: React.FC = () => {
  const userId = 1;
  const [formData, setFormData] = useState({
    nombre: '',
    viejaContrasena: '',
    nuevaContrasena: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos del usuario al iniciar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUserById(userId);
        setFormData({ ...formData, nombre: user.nombre });
      } catch (error) {
        setError('Hubo un error al cargar los datos del usuario');
      }
    };
    loadUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      // Actualizar el nombre del usuario
      await updateUser(userId, { nombre: formData.nombre });
      alert('Nombre actualizado exitosamente');
      setIsEditing(false); // Desactivar modo edición
    } catch (error) {
      setError('Hubo un error al actualizar el perfil');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validar que se hayan ingresado ambas contraseñas
      if (!formData.viejaContrasena || !formData.nuevaContrasena) {
        throw new Error('Debes ingresar tu contraseña antigua y la nueva contraseña');
      }

      // Cambiar la contraseña del usuario
      await changePassword(userId, {
        vieja: formData.viejaContrasena,
        nueva: formData.nuevaContrasena,
      });
      alert('Contraseña actualizada exitosamente');
      setFormData({ ...formData, viejaContrasena: '', nuevaContrasena: '' });
      setShowPasswordForm(false); // Ocultar el formulario de cambio de contraseña
    } catch (error) {
      setError('Hubo un error al cambiar la contraseña');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Mi Perfil</h2>

      {/* Mostrar errores */}
      {error && <p className="error">{error}</p>}

      {/* Formulario para actualizar el nombre */}
      <div className="formGroup">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
      </div>

      {/* Botones para editar y guardar */}
      <div className="actions">
        {isEditing ? (
          <>
            <button className="actionButton" onClick={handleUpdateProfile}>
              Guardar cambios
            </button>
            <button className="actionButton cancelButton" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="actionButton" onClick={() => setIsEditing(true)}>
            Editar perfil
          </button>
        )}
      </div>

      {/* Sección para cambiar la contraseña */}
      <div className="passwordSection">
        <h3>Cambiar Contraseña</h3>
        {!showPasswordForm ? (
          <button className="actionButton" onClick={() => setShowPasswordForm(true)}>
            Cambiar contraseña
          </button>
        ) : (
          <>
            <div className="formGroup">
              <label>
                Contraseña actual:
                <input
                  type="password"
                  name="viejaContrasena"
                  value={formData.viejaContrasena}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="formGroup">
              <label>
                Nueva contraseña:
                <input
                  type="password"
                  name="nuevaContrasena"
                  value={formData.nuevaContrasena}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="actions">
              <button className="actionButton" onClick={handleChangePassword}>
                Guardar nueva contraseña
              </button>
              <button
                className="actionButton cancelButton"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;