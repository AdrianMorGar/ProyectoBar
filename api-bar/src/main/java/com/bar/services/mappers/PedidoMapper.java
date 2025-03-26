package com.bar.services.mappers;

import java.util.ArrayList;
import java.util.List;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.services.dtos.PedidoDTO;


public class PedidoMapper {

    public static PedidoDTO toDto(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setFecha(pedido.getFecha());
        dto.setEstado(pedido.getEstado());
        dto.setMesa(pedido.getMesa());
        dto.setCliente(pedido.getNombreCliente());

        // Calcular el total dinámicamente
        double total = 0;
        for (DetallePedido detalle : pedido.getDetalles()) {
            total += detalle.getCantidad() * detalle.getPlato().getPrecio();
        }
        dto.setTotal(total);

        // Mapear los detalles del pedido
        dto.setDetalles(DetallePedidoMapper.toDtos(pedido.getDetalles()));

        return dto;
    }

    public static List<PedidoDTO> toDtos(List<Pedido> pedidos) {
        List<PedidoDTO> pedidoDTOs = new ArrayList<>();
        for (Pedido p : pedidos) {
            pedidoDTOs.add(toDto(p));
        }
        return pedidoDTOs;
    }
}
