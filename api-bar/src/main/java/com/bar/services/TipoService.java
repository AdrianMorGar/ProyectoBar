package com.bar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.Tipo;
import com.bar.persistence.repositories.TipoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TipoService {

	@Autowired
	private TipoRepository tipoRepository;

	public List<Tipo> findAll() {
		return tipoRepository.findAll();
	}

	public boolean existsById(Integer id) {
		return tipoRepository.existsById(id);
	}

	public Optional<Tipo> findEntityById(Integer id) {
		return tipoRepository.findById(id);
	}

	public Tipo create(Tipo tipo) {
		return tipoRepository.save(tipo);
	}

	public Tipo save(Tipo tipo) {
		return tipoRepository.save(tipo);
	}

	public boolean delete(Integer id) {
		if (tipoRepository.existsById(id)) {
			tipoRepository.deleteById(id);
			return true;
		}
		return false;
	}
}
