package com.bar.web.controllers;

import com.bar.services.DetallePedidoService;
import com.bar.services.dtos.DetallePedidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("detalles-pedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping
    public ResponseEntity<List<DetallePedidoDTO>> listarDetalles(@RequestParam Integer pedidoId) {
        List<DetallePedidoDTO> detalles = detallePedidoService.listarDetallesPorPedido(pedidoId);
        return ResponseEntity.ok(detalles);
    }

    @PostMapping
    public ResponseEntity<DetallePedidoDTO> create(@RequestBody DetallePedidoDTO detalleDTO) {
        DetallePedidoDTO nuevoDetalle = detallePedidoService.create(detalleDTO);
        return new ResponseEntity<>(nuevoDetalle, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetallePedidoDTO> update(@PathVariable Integer id, @RequestBody DetallePedidoDTO detalleDTO) {
        DetallePedidoDTO detalleActualizado = detallePedidoService.update(id, detalleDTO);
        return ResponseEntity.ok(detalleActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (detallePedidoService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}