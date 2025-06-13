package com.bar.services.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PedidoDTO {
    private Integer id;
    private String nombreCliente;
    private Integer mesa;
    private LocalDateTime fecha;
    private Boolean pagado;
    private Double total;

    @JsonProperty("usuario_id")
    private Integer usuarioId;
    
    private List<DetallePedidoOutputDTO> detalles;
}