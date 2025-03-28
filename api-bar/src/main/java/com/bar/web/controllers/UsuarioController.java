package com.bar.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bar.persistence.entities.Usuario;
import com.bar.services.UsuarioService;
import com.bar.services.dtos.PasswordDTO;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> list() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> findById(@PathVariable Integer id) {
        if (!usuarioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuarioService.findEntityById(id).get());
    }

    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        return new ResponseEntity<>(usuarioService.create(usuario), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Integer id, @RequestBody Usuario usuario) {
        if (!id.equals(usuario.getId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!usuarioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuarioService.save(usuario));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleUsuario(@PathVariable Integer id) {
        if (!usuarioService.toggleUsuario(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Object> cambiarPassword(@PathVariable Integer id, @RequestBody PasswordDTO passwordDTO) {
        try {
            Usuario usuario = usuarioService.cambiarPassword(id, passwordDTO);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}