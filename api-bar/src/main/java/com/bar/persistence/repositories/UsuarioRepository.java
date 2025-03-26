package com.bar.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	Optional<Usuario> findByNombre(String nombre);

	Boolean existsByNombre(String nombre);
}