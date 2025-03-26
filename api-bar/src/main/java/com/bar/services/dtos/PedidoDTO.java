package com.bar.services.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.bar.persistence.entities.enums.EstadoPedido;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PedidoDTO {
    private Integer id;
    private LocalDateTime fecha;
    private Double total;
    private EstadoPedido estado;
    private Integer mesa;
    private String cliente;
    private List<DetallePedidoOutputDTO> detalles;
}