package com.bar.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.enums.EstadoPedido;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByMesaAndEstado(Integer mesa, EstadoPedido estado);
}
