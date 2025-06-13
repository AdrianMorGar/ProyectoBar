package com.bar.services;

import com.bar.persistence.entities.Plato;
import com.bar.persistence.entities.enums.Categoria;
import com.bar.persistence.repositories.PlatoRepository;
import com.bar.services.dtos.PlatoDTO;
import com.bar.services.mappers.PlatoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
		Plato plato = platoRepository.findById(id).orElse(null);
		return plato != null ? PlatoMapper.toDto(plato) : null;
	}

	public PlatoDTO create(PlatoDTO platoDTO) {
		Plato plato = PlatoMapper.toEntity(platoDTO);
		plato.setHabilitado(true);
		plato.setDisponible(true);
		Plato saved = platoRepository.save(plato);
		return PlatoMapper.toDto(saved);
	}

	public PlatoDTO update(Integer id, PlatoDTO platoDTO) {
		Plato plato = PlatoMapper.toEntity(platoDTO);
		plato.setId(id);
		Plato updated = platoRepository.save(plato);
		return PlatoMapper.toDto(updated);
	}

	public boolean togglePlato(Integer id) {
		Plato plato = platoRepository.findById(id).orElse(null);
		if (plato != null) {
			plato.setHabilitado(!plato.getHabilitado());
			platoRepository.save(plato);
			return true;
		}
		return false;
	}

	public boolean toggleDisponible(Integer id) {
		Plato plato = platoRepository.findById(id).orElse(null);
		if (plato != null) {
			plato.setDisponible(!plato.getDisponible());
			platoRepository.save(plato);
			return true;
		}
		return false;
	}

	public List<PlatoDTO> buscarPorNombre(String nombre) {
		List<Plato> platos = platoRepository.findByNombrePlatoContainingIgnoreCase(nombre);
		return PlatoMapper.toDtos(platos);
	}
}