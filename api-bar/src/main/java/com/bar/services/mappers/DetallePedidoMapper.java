package com.bar.services.mappers;

import java.util.ArrayList;
import java.util.List;

import com.bar.persistence.entities.DetallePedido;
import com.bar.services.dtos.DetallePedidoOutputDTO;

public class DetallePedidoMapper {

    public static DetallePedidoOutputDTO toDto(DetallePedido detalle) {
        DetallePedidoOutputDTO dto = new DetallePedidoOutputDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPlato().getPrecio());
        dto.setPlato(detalle.getPlato().getNombrePlato()); // Atributo adicional útil
        return dto;
    }

    public static List<DetallePedidoOutputDTO> toDtos(List<DetallePedido> detalles) {
        List<DetallePedidoOutputDTO> detalleDTOs = new ArrayList<>();
        for (DetallePedido d : detalles) {
            detalleDTOs.add(toDto(d));
        }
        return detalleDTOs;
    }
}
