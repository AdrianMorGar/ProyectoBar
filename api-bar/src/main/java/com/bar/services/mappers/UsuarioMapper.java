package com.bar.services.mappers;

import com.bar.persistence.entities.Usuario;
import com.bar.services.dtos.UsuarioInputDTO;
import com.bar.services.dtos.UsuarioOutputDTO;

public class UsuarioMapper {

	public static UsuarioOutputDTO toOutputDto(Usuario usuario) {
		UsuarioOutputDTO dto = new UsuarioOutputDTO();
		dto.setId(usuario.getId());
		dto.setNombre(usuario.getNombre());
		dto.setRol(usuario.getRol());
		return dto;
	}

	public static Usuario toEntity(UsuarioInputDTO dto) {
		Usuario usuario = new Usuario();
		usuario.setId(dto.getId());
		usuario.setNombre(dto.getNombre());
		usuario.setContrasena(dto.getContrasena());
		usuario.setHabilitado(dto.getHabilitado());
		usuario.setRol(dto.getRol());
		return usuario;
	}
}