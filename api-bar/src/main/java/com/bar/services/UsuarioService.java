package com.bar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.Usuario;
import com.bar.persistence.repositories.UsuarioRepository;
import com.bar.services.dtos.PasswordDTO;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public boolean existsById(Integer id) {
        return usuarioRepository.existsById(id);
    }

    public Optional<Usuario> findEntityById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario create(Usuario usuario) {
        usuario.setHabilitado(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario cambiarPassword(Integer id, PasswordDTO passwordDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getContrasena().equals(passwordDTO.getVieja())) {
            throw new RuntimeException("La contraseña antigua no coincide");
        }

        usuario.setContrasena(passwordDTO.getNueva());
        return usuarioRepository.save(usuario);
    }

    public boolean toggleUsuario(Integer id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            usuario.setHabilitado(!usuario.getHabilitado());
            usuarioRepository.save(usuario);
            return true;
        }
        return false;
    }
}