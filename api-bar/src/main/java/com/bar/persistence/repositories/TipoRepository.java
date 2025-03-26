package com.bar.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Tipo;

public interface TipoRepository extends JpaRepository<Tipo, Integer> {

}
