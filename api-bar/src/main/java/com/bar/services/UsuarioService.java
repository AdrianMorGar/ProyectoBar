package com.bar.services;

import com.bar.persistence.entities.Usuario;
import com.bar.persistence.entities.enums.Rol;
import com.bar.persistence.repositories.UsuarioRepository;
import com.bar.services.dtos.PasswordDTO;
import com.bar.services.dtos.UsuarioInputDTO;
import com.bar.services.dtos.UsuarioOutputDTO;
import com.bar.services.mappers.UsuarioMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioOutputDTO> findAll() {
        List<UsuarioOutputDTO> usuariosDTO = new ArrayList<>();
        for (Usuario usuario : this.usuarioRepository.findAll()) {
            usuariosDTO.add(UsuarioMapper.toOutputDto(usuario));
        }
        return usuariosDTO;
    }

    public Optional<Usuario> findEntityById(Integer id) {
        return this.usuarioRepository.findById(id);
    }

    public UsuarioOutputDTO findById(Integer id) {
        Usuario usuario = this.usuarioRepository.findById(id).orElse(null);
        return usuario != null ? UsuarioMapper.toOutputDto(usuario) : null;
    }

    public boolean existsById(Integer id) {
        return this.usuarioRepository.existsById(id);
    }

    public UsuarioOutputDTO create(UsuarioInputDTO usuarioInputDTO) {
        if (usuarioInputDTO.getContrasena() == null || usuarioInputDTO.getContrasena().isEmpty()) {
            throw new RuntimeException("La contraseña no puede ser nula o vacía");
        }

        Usuario usuario = UsuarioMapper.toEntity(usuarioInputDTO);

        usuario.setHabilitado(true);
        usuario.setRol(Rol.TRABAJADOR);

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return UsuarioMapper.toOutputDto(savedUsuario);
    }

    public UsuarioOutputDTO save(UsuarioInputDTO usuarioInputDTO) {
        Usuario usuario = UsuarioMapper.toEntity(usuarioInputDTO);
        Usuario updatedUsuario = this.usuarioRepository.save(usuario);
        return UsuarioMapper.toOutputDto(updatedUsuario);
    }

    public UsuarioOutputDTO cambiarPassword(Integer id, PasswordDTO passwordDTO) {
        Usuario usuario = this.usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        if (!usuario.getContrasena().equals(passwordDTO.getVieja())) {
            throw new RuntimeException("La contraseña antigua no coincide");
        }

        usuario.setContrasena(passwordDTO.getNueva());
        Usuario updatedUsuario = this.usuarioRepository.save(usuario);
        return UsuarioMapper.toOutputDto(updatedUsuario);
    }

    public boolean toggleUsuario(Integer id) {
        Usuario usuario = this.usuarioRepository.findById(id).orElse(null);
        if (usuario != null) {
            usuario.setHabilitado(!usuario.getHabilitado());
            this.usuarioRepository.save(usuario);
            return true;
        }
        return false;
    }
}