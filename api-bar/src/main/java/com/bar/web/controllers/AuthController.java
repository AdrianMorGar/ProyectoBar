package com.bar.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.bar.web.config.jwt.JwtUtils;
import com.bar.services.dtos.LoginDTO;
import com.bar.services.dtos.UsuarioOutputDTO;
import com.bar.persistence.entities.Usuario;
import com.bar.services.mappers.UsuarioMapper;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
		UsernamePasswordAuthenticationToken login = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(),
				loginDTO.getPassword());
		Authentication authentication = this.authenticationManager.authenticate(login);

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = this.jwtUtils.createToken(authentication);

		Usuario usuario = (Usuario) authentication.getPrincipal();
		UsuarioOutputDTO usuarioDTO = UsuarioMapper.toOutputDto(usuario);

		return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt).body(usuarioDTO);
	}
}
