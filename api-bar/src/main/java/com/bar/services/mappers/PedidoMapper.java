package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
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
        dto.setEstado(pedido.getEstado());

        double total = 0;
        for (DetallePedido detalle : pedido.getDetalles()) {
            total += detalle.getCantidad() * detalle.getPlato().getPrecio();
        }
        dto.setTotal(total);

        dto.setDetalles(PedidoDetalleMapper.toDtos(pedido.getDetalles()));

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