package com.bar.web.controllers;

import com.bar.services.UsuarioService;
import com.bar.services.dtos.PasswordDTO;
import com.bar.services.dtos.UsuarioInputDTO;
import com.bar.services.dtos.UsuarioOutputDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@GetMapping
	public ResponseEntity<List<UsuarioOutputDTO>> list() {
		return ResponseEntity.ok(usuarioService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UsuarioOutputDTO> findById(@PathVariable Integer id) {
		UsuarioOutputDTO usuarioDTO = usuarioService.findById(id);
		if (usuarioDTO == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(usuarioDTO);
	}

	@PostMapping
	public ResponseEntity<UsuarioOutputDTO> create(@RequestBody UsuarioInputDTO usuarioInputDTO) {
		UsuarioOutputDTO createdUsuario = usuarioService.create(usuarioInputDTO);
		return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<UsuarioOutputDTO> update(@PathVariable Integer id,
			@RequestBody UsuarioInputDTO usuarioInputDTO) {
		if (!id.equals(usuarioInputDTO.getId())) {
			return ResponseEntity.badRequest().build();
		}
		UsuarioOutputDTO updatedUsuario = usuarioService.save(usuarioInputDTO);
		if (updatedUsuario == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(updatedUsuario);
	}

	@PutMapping("/{id}/toggle")
	public ResponseEntity<Void> toggleUsuario(@PathVariable Integer id) {
		boolean result = usuarioService.toggleUsuario(id);
		if (!result) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/password")
	public ResponseEntity<Object> cambiarPassword(@PathVariable Integer id, @RequestBody PasswordDTO passwordDTO) {
		try {
			UsuarioOutputDTO usuarioDTO = usuarioService.cambiarPassword(id, passwordDTO);
			return ResponseEntity.ok(usuarioDTO);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}