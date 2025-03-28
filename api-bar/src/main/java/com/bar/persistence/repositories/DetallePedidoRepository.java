package com.bar.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.DetallePedido;


public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {

	List<DetallePedido> findByPedidoId(Integer pedidoId);
}
