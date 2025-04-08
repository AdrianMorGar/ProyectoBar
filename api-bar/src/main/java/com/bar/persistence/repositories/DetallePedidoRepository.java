package com.bar.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.DetallePedido;


public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {    
}
