package com.bar.services.mappers;

import com.bar.persistence.entities.Plato;
import com.bar.persistence.entities.Tipo;
import com.bar.services.dtos.PlatoDTO;

import java.util.ArrayList;
import java.util.List;

public class PlatoMapper {

    public static PlatoDTO toDto(Plato plato) {
        PlatoDTO dto = new PlatoDTO();
        dto.setId(plato.getId());
        dto.setNombrePlato(plato.getNombrePlato());
        dto.setDescripcion(plato.getDescripcion());
        dto.setPrecio(plato.getPrecio());
        dto.setCategoria(plato.getCategoria());
        dto.setDisponible(plato.getDisponible());
        dto.setHabilitado(plato.getHabilitado());
        dto.setImagen(plato.getImagen());

        if (plato.getTipo() != null) {
            dto.setTipoId(plato.getTipo().getId());
        }

        return dto;
    }

    public static List<PlatoDTO> toDtos(List<Plato> platos) {
        List<PlatoDTO> platoDTOs = new ArrayList<>();
        for (Plato plato : platos) {
            platoDTOs.add(toDto(plato));
        }
        return platoDTOs;
    }

    public static Plato toEntity(PlatoDTO dto) {
        Plato plato = new Plato();
        plato.setId(dto.getId());
        plato.setNombrePlato(dto.getNombrePlato());
        plato.setDescripcion(dto.getDescripcion());
        plato.setPrecio(dto.getPrecio());
        plato.setCategoria(dto.getCategoria());
        plato.setDisponible(dto.getDisponible());
        plato.setHabilitado(dto.getHabilitado());
        plato.setImagen(dto.getImagen());

        if (dto.getTipoId() != null) {
            Tipo tipo = new Tipo();
            tipo.setId(dto.getTipoId());
            plato.setTipo(tipo);
        }

        return plato;
    }
}