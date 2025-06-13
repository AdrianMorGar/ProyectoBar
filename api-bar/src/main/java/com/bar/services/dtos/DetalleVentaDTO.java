package com.bar.services.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetalleVentaDTO {
	private int id;
	private int cantidad;
	private double precioUnitario;
	private String plato;
}