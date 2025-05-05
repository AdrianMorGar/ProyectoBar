package com.bar.web.controllers;

import com.bar.services.TipoService;
import com.bar.persistence.entities.Tipo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("tipos")
public class TipoController {

    @Autowired
    private TipoService tipoService;

    @GetMapping
    public ResponseEntity<List<Tipo>> list() {
        return ResponseEntity.ok(tipoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tipo> findById(@PathVariable Integer id) {
        if (!tipoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tipoService.findEntityById(id).get());
    }

    @PostMapping
    public ResponseEntity<Tipo> create(@RequestBody Tipo tipo) {
        Tipo nuevoTipo = tipoService.create(tipo);
        return new ResponseEntity<>(nuevoTipo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tipo> update(@PathVariable Integer id, @RequestBody Tipo tipo) {
        if (!id.equals(tipo.getId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!tipoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tipoService.save(tipo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (tipoService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}