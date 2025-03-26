package com.bar.services.dtos;

import com.bar.persistence.entities.enums.Categoria;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlatoDTO {
    private Integer id;
    private String nombrePlato;
    private Double precio;
    private Categoria categoria;
    private Boolean disponible;
    private Boolean habilitado;
    private String imagen;
    private String tipo;
}
