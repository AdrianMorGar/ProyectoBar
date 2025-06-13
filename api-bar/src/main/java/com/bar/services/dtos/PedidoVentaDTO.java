package com.bar.services.dtos;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PedidoVentaDTO {
	private int id;
    private String trabajador;
    private Integer mesa;
    private String nombreCliente;
    private double total;
    
    private List<DetalleVentaDTO> detalles;
}
