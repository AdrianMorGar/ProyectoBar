package com.bar.services.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

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
    private List<DetallePedidoOutputDTO> detalles;
}