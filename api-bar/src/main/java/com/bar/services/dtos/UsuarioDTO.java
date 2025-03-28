package com.bar.services.dtos;

import com.bar.persistence.entities.enums.Rol;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioDTO {
    private Integer id;
    private String nombre;
    private Rol rol;
    private Boolean habilitado;
}