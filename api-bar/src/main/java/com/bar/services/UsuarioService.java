package com.bar.services;

import com.bar.persistence.entities.Usuario;
import com.bar.persistence.entities.enums.Rol;
import com.bar.persistence.repositories.UsuarioRepository;
import com.bar.services.dtos.PasswordDTO;
import com.bar.services.dtos.UsuarioInputDTO;
import com.bar.services.dtos.UsuarioOutputDTO;
import com.bar.services.mappers.UsuarioMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<UsuarioOutputDTO> findAll() {
		List<UsuarioOutputDTO> usuariosDTO = new ArrayList<>();
		for (Usuario usuario : this.usuarioRepository.findByHabilitadoTrue()) {
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

		usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

		Usuario savedUsuario = usuarioRepository.save(usuario);
		return UsuarioMapper.toOutputDto(savedUsuario);
	}

	public UsuarioOutputDTO save(UsuarioInputDTO usuarioInputDTO) {
		Usuario usuario = UsuarioMapper.toEntity(usuarioInputDTO);

		usuario.setHabilitado(true);

		if (usuario.getRol() == Rol.DUENO) {
			usuario.setRol(Rol.DUENO);
		} else {
			usuario.setRol(Rol.TRABAJADOR);
		}

		usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

		Usuario updatedUsuario = this.usuarioRepository.save(usuario);
		return UsuarioMapper.toOutputDto(updatedUsuario);
	}

	public UsuarioOutputDTO cambiarPassword(Integer id, PasswordDTO passwordDTO) {
		Usuario usuario = this.usuarioRepository.findById(id).orElse(null);
		if (usuario == null) {
			throw new RuntimeException("Usuario no encontrado");
		}

		if (!passwordEncoder.matches(passwordDTO.getVieja(), usuario.getContrasena())) {
			throw new RuntimeException("La contraseña antigua no coincide");
		}
		usuario.setContrasena(passwordEncoder.encode(passwordDTO.getNueva()));

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