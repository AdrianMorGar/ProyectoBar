package com.bar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.Plato;
import com.bar.persistence.entities.enums.Categoria;
import com.bar.persistence.repositories.PlatoRepository;
import com.bar.services.dtos.PlatoDTO;
import com.bar.services.mappers.PlatoMapper;

import java.util.List;

@Service
public class PlatoService {

    @Autowired
    private PlatoRepository platoRepository;

    public List<PlatoDTO> listarPlatosActivos(Categoria categoria) {
        List<Plato> platos;
        if (categoria != null) {
            platos = platoRepository.findByHabilitadoTrueAndCategoria(categoria);
        } else {
            platos = platoRepository.findByHabilitadoTrue();
        }
        return PlatoMapper.toDtos(platos);
    }
    
    public PlatoDTO findById(Integer id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El plato con ID " + id + " no existe"));
        return PlatoMapper.toDto(plato);
    }

    public PlatoDTO create(PlatoDTO platoDTO) {
        Plato plato = PlatoMapper.toEntity(platoDTO);
        plato.setHabilitado(true);
        Plato saved = platoRepository.save(plato);
        return PlatoMapper.toDto(saved);
    }

    public PlatoDTO update(Integer id, PlatoDTO platoDTO) {
        Plato plato = PlatoMapper.toEntity(platoDTO);
        plato.setId(id);
        Plato updated = platoRepository.save(plato);
        return PlatoMapper.toDto(updated);
    }

    public void togglePlato(Integer id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));
        plato.setHabilitado(!plato.getHabilitado());
        platoRepository.save(plato);
    }

    public List<PlatoDTO> buscarPorNombre(String nombre) {
        List<Plato> platos = platoRepository.findByNombrePlatoContainingIgnoreCase(nombre);
        return PlatoMapper.toDtos(platos);
    }
}