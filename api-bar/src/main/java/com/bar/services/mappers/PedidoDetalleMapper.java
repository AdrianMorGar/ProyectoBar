package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.services.dtos.DetallePedidoOutputDTO;

import java.util.ArrayList;
import java.util.List;

public class PedidoDetalleMapper {

    public static DetallePedidoOutputDTO toDto(DetallePedido detalle) {
        DetallePedidoOutputDTO dto = new DetallePedidoOutputDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPlato().getPrecio());
        dto.setPlato(detalle.getPlato().getNombrePlato());
        return dto;
    }

    public static List<DetallePedidoOutputDTO> toDtos(List<DetallePedido> detalles) {
        List<DetallePedidoOutputDTO> detalleDTOs = new ArrayList<>();
        for (DetallePedido detalle : detalles) {
            detalleDTOs.add(toDto(detalle));
        }
        return detalleDTOs;
    }
}