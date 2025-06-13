package com.bar.persistence.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar.persistence.entities.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
	List<Pedido> findByFecha(LocalDateTime fecha);

	List<Pedido> findByFechaBetween(LocalDateTime atStartOfDay, LocalDateTime atStartOfDay2);

	List<Pedido> findByMesaAndPagadoFalse(Integer mesa);

}
