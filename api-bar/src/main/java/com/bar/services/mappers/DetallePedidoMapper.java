package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.services.dtos.DetallePedidoDTO;

import java.util.ArrayList;
import java.util.List;

public class DetallePedidoMapper {

    public static DetallePedidoDTO toDto(DetallePedido detalle) {
        DetallePedidoDTO dto = new DetallePedidoDTO();
        dto.setId(detalle.getId());
        dto.setPedidoId(detalle.getPedido().getId());
        dto.setPlatoId(detalle.getPlato().getId());
        dto.setCantidad(detalle.getCantidad());
        return dto;
    }

    public static List<DetallePedidoDTO> toDtos(List<DetallePedido> detalles) {
        List<DetallePedidoDTO> detalleDTOs = new ArrayList<>();
        for (DetallePedido detalle : detalles) {
            detalleDTOs.add(toDto(detalle));
        }
        return detalleDTOs;
    }

    public static DetallePedido toEntity(DetallePedidoDTO dto) {
        DetallePedido detalle = new DetallePedido();
        detalle.setId(dto.getId());
        detalle.setCantidad(dto.getCantidad());
        return detalle;
    }
}