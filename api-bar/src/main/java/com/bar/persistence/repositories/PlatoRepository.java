package com.bar.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Plato;
import com.bar.persistence.entities.enums.Categoria;

public interface PlatoRepository extends JpaRepository<Plato, Integer> {
    List<Plato> findByDisponibleTrue();

	List<Plato> findByNombrePlatoContainingIgnoreCase(String nombre);

	List<Plato> findByHabilitadoTrueAndCategoria(Categoria categoria);

	List<Plato> findByHabilitadoTrue();
}
