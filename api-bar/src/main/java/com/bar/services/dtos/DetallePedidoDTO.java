package com.bar.services.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetallePedidoDTO {
    private Integer id;
    private Integer pedidoId;
    private Integer platoId;
    private Integer cantidad;
}