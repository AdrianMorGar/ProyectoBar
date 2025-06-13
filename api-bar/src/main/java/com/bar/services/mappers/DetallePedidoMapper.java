package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Plato;
import com.bar.services.dtos.DetallePedidoInputDTO;
import com.bar.services.dtos.DetallePedidoOutputDTO;

import java.util.ArrayList;
import java.util.List;

public class DetallePedidoMapper {

	public static DetallePedido toEntity(DetallePedidoInputDTO dto) {
		DetallePedido detalle = new DetallePedido();
		detalle.setId(dto.getId());
		detalle.setCantidad(dto.getCantidad());
		detalle.setNotas(dto.getNotas());

		Plato plato = new Plato();
		plato.setId(dto.getPlatoId());
		detalle.setPlato(plato);

		detalle.setEstado(dto.getEstado());

		return detalle;
	}

	public static DetallePedidoOutputDTO toOutputDto(DetallePedido detalle) {
		DetallePedidoOutputDTO dto = new DetallePedidoOutputDTO();
		dto.setId(detalle.getId());
		dto.setCantidad(detalle.getCantidad());
		dto.setNotas(detalle.getNotas());
		dto.setPrecioUnitario(detalle.getPlato().getPrecio());
		dto.setPlato(detalle.getPlato().getNombrePlato());
		dto.setEstado(detalle.getEstado());

		dto.setMesa(detalle.getPedido().getMesa());

		return dto;
	}

	public static List<DetallePedidoOutputDTO> toOutputDtos(List<DetallePedido> detalles) {
		List<DetallePedidoOutputDTO> detalleDTOs = new ArrayList<>();
		for (DetallePedido detalle : detalles) {
			detalleDTOs.add(toOutputDto(detalle));
		}
		return detalleDTOs;
	}
}