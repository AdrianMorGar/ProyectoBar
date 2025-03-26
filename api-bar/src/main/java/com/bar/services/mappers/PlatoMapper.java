package com.bar.services.mappers;

import java.util.ArrayList;
import java.util.List;

import com.bar.persistence.entities.Plato;
import com.bar.services.dtos.PlatoDTO;

public class PlatoMapper {

    public static PlatoDTO toDto(Plato plato) {
        PlatoDTO dto = new PlatoDTO();
        dto.setId(plato.getId());
        dto.setNombrePlato(plato.getNombrePlato());
        dto.setPrecio(plato.getPrecio());
        dto.setCategoria(plato.getCategoria());
        dto.setDisponible(plato.getDisponible());
        dto.setHabilitado(plato.getHabilitado());
        dto.setImagen(plato.getImagen());
        dto.setTipo(plato.getTipo().getNombreTipo()); // Atributo adicional útil
        return dto;
    }

    public static List<PlatoDTO> toDtos(List<Plato> platos) {
        List<PlatoDTO> platoDTOs = new ArrayList<>();
        for (Plato p : platos) {
            platoDTOs.add(toDto(p));
        }
        return platoDTOs;
    }
}
