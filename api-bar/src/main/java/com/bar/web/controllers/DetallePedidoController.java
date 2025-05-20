package com.bar.web.controllers;

import com.bar.services.DetallePedidoService;
import com.bar.services.dtos.DetallePedidoInputDTO;
import com.bar.services.dtos.DetallePedidoOutputDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/detalles-pedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping
    public ResponseEntity<List<DetallePedidoOutputDTO>> list() {
        return ResponseEntity.ok(detallePedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedidoOutputDTO> buscarDetallePorId(@PathVariable int id) {
        DetallePedidoOutputDTO detalleDTO = detallePedidoService.findById(id);
        if (detalleDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalleDTO);
    }

    @PostMapping
    public ResponseEntity<DetallePedidoOutputDTO> create(@RequestBody DetallePedidoInputDTO detalleDTO) {
        DetallePedidoOutputDTO nuevoDetalle = detallePedidoService.create(detalleDTO);
        return new ResponseEntity<>(nuevoDetalle, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetallePedidoOutputDTO> update(@PathVariable int id, @RequestBody DetallePedidoInputDTO detalleDTO) {
        DetallePedidoOutputDTO detalleActualizado = detallePedidoService.update(id, detalleDTO);
        return ResponseEntity.ok(detalleActualizado);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarPlato(@PathVariable int id) {
        detallePedidoService.cancelarPlato(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{id}/servir")
    public ResponseEntity<Void> servirPlato(@PathVariable int id) {
        detallePedidoService.servirPlato(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{id}/pendiente")
    public ResponseEntity<Void> pendientePlato(@PathVariable int id) {
        detallePedidoService.pendientePlato(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-estado")
    public ResponseEntity<Void> toggleEstadoPlato(@PathVariable int id) {
        detallePedidoService.toggleEstadoPlato(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        boolean result = detallePedidoService.delete(id);
        if (!result) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/activo")
    public ResponseEntity<List<Map<String, Object>>> listarDetallesActivo() {
        List<Map<String, Object>> detallesPorMesa = detallePedidoService.listarDetallesActivo();
        return ResponseEntity.ok(detallesPorMesa);
    }
    
    @GetMapping("/bebidas")
    public ResponseEntity<List<Map<String, Object>>> listarBebidas() {
        return ResponseEntity.ok(detallePedidoService.listarBebidas());
    }


}