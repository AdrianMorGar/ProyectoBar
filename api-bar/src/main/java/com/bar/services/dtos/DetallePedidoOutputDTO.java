package com.bar.services.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetallePedidoOutputDTO {
    private Integer id;
    private Integer cantidad;
    private Double precioUnitario;
    private String plato;
}
