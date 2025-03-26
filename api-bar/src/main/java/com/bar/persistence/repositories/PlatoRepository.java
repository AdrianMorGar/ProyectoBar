package com.bar.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Plato;

public interface PlatoRepository extends JpaRepository<Plato, Integer> {
    List<Plato> findByDisponibleTrue();
}
