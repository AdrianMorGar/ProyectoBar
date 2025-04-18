package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.services.dtos.PedidoDTO;
import java.util.ArrayList;
import java.util.List;

public class PedidoMapper {

	public static PedidoDTO toDto(Pedido pedido) {
	    PedidoDTO dto = new PedidoDTO();
	    dto.setId(pedido.getId());
	    dto.setNombreCliente(pedido.getNombreCliente());
	    dto.setMesa(pedido.getMesa());
	    dto.setFecha(pedido.getFecha());
	    dto.setPagado(pedido.getPagado());

	    double total = 0.0;
	    if (pedido.getDetalles() != null) {
	        for (DetallePedido detalle : pedido.getDetalles()) {
	            if (detalle.getEstado() != EstadoPedido.CANCELADO && detalle.getPlato() != null) {
	                total += detalle.getCantidad() * detalle.getPlato().getPrecio();
	            }
	        }
	    }
	    dto.setTotal(total);

	    if (pedido.getDetalles() != null) {
	        dto.setDetalles(DetallePedidoMapper.toOutputDtos(pedido.getDetalles()));
	    } else {
	        dto.setDetalles(new ArrayList<>());
	    }

	    return dto;
	}

    public static Pedido toEntity(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setNombreCliente(dto.getNombreCliente());
        pedido.setMesa(dto.getMesa());
        pedido.setFecha(dto.getFecha());
        pedido.setPagado(dto.getPagado());
        return pedido;
    }

    public static List<PedidoDTO> toDtos(List<Pedido> pedidos) {
        List<PedidoDTO> pedidoDTOs = new ArrayList<>();
        for (Pedido p : pedidos) {
            pedidoDTOs.add(toDto(p));
        }
        return pedidoDTOs;
    }
}