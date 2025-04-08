package com.bar.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}