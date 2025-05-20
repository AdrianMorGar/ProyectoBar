import React, { useState, useEffect } from 'react';
import { fetchUserById, updateUser, changePassword } from '../../api';

const UserProfile: React.FC = () => {
  const userId = 1;
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    viejaContrasena: '',
    nuevaContrasena: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUserById(userId);
        setUserData(user);
        setFormData((prev) => ({ ...prev, nombre: user.nombre }));
      } catch (error) {
        setError('Hubo un error al cargar los datos del usuario');
      }
    };
    loadUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!userData) return;

    const { nombre, viejaContrasena, nuevaContrasena } = formData;

    if (!viejaContrasena) {
      setError('Debes ingresar tu contraseña actual para guardar los cambios.');
      return;
    }

    try {
      let passwordToUse = viejaContrasena;

      if (nuevaContrasena) {
        await changePassword(userId, {
          vieja: viejaContrasena,
          nueva: nuevaContrasena,
        });
        passwordToUse = nuevaContrasena;
      }

      await updateUser(userId, {
        id: userId,
        nombre,
        rol: userData.rol,
        contrasena: passwordToUse,
        habilitado: true,
      });

      alert('Perfil actualizado exitosamente');
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        viejaContrasena: '',
        nuevaContrasena: '',
      }));
    } catch (error) {
      setError('Hubo un error al guardar los cambios. Verifica la contraseña actual.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Administrador</h2>
      {error && <p className="error">{error}</p>}

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

      {isEditing && (
        <>
          <h3>Cambiar Contraseña</h3>
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
        </>
      )}

      <div className="actions">
        {isEditing ? (
          <>
            <button className="actionButton" onClick={handleSaveChanges}>
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
    </div>
  );
};

export default UserProfile;
