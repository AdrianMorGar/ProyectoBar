package com.bar.services.dtos;

import com.bar.persistence.entities.enums.EstadoPedido;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetallePedidoInputDTO {
    private Integer id;
    private Integer pedidoId;
    private Integer platoId;
    private Integer cantidad;
    private String notas;
    private EstadoPedido estado;
}