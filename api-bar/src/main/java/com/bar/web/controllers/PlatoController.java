package com.bar.web.controllers;

import com.bar.persistence.entities.enums.Categoria;
import com.bar.services.PlatoService;
import com.bar.services.dtos.PlatoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("platos")
public class PlatoController {

    @Autowired
    private PlatoService platoService;

    @GetMapping
    public ResponseEntity<List<PlatoDTO>> listarPlatos(@RequestParam(required = false) Categoria categoria) {
        List<PlatoDTO> platos = platoService.listarPlatosActivos(categoria);
        return ResponseEntity.ok(platos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoDTO> findById(@PathVariable Integer id) {
        PlatoDTO platoDTO = platoService.findById(id);
        if (platoDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(platoDTO);
    }

    @PostMapping
    public ResponseEntity<PlatoDTO> create(@RequestBody PlatoDTO platoDTO) {
        PlatoDTO nuevoPlato = platoService.create(platoDTO);
        return new ResponseEntity<>(nuevoPlato, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatoDTO> update(@PathVariable Integer id, @RequestBody PlatoDTO platoDTO) {
        PlatoDTO platoActualizado = platoService.update(id, platoDTO);
        if (platoActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(platoActualizado);
    }

    @PatchMapping("/{id}/toggle/habilitado")
    public ResponseEntity<Void> togglePlato(@PathVariable Integer id) {
        boolean result = platoService.togglePlato(id);
        if (!result) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{id}/toggle/Disponible")
    public ResponseEntity<Void> toggleDisponible(@PathVariable Integer id) {
        boolean result = platoService.toggleDisponible(id);
        if (!result) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PlatoDTO>> buscarPorNombre(@RequestParam String nombre) {
        List<PlatoDTO> platos = platoService.buscarPorNombre(nombre);
        return ResponseEntity.ok(platos);
    }
}