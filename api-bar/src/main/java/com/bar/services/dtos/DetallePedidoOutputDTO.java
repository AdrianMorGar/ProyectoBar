package com.bar.services.dtos;

import com.bar.persistence.entities.enums.EstadoPedido;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetallePedidoOutputDTO {
	private Integer id;
	private Integer cantidad;
	private String notas;
	private Double precioUnitario;
	private String plato;
	private EstadoPedido estado;
	@JsonIgnore
	private Integer mesa;

}