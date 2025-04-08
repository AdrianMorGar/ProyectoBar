package com.bar.web.controllers;

import com.bar.services.PedidoService;
import com.bar.services.dtos.PedidoDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> list() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<PedidoDTO> findById(@PathVariable int idPedido) {
        PedidoDTO pedidoDTO = pedidoService.findById(idPedido);
        if (pedidoDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pedidoDTO);
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> create(@RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO nuevoPedido = pedidoService.create(pedidoDTO);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @PutMapping("/{idPedido}")
    public ResponseEntity<PedidoDTO> update(@PathVariable int idPedido, @RequestBody PedidoDTO pedidoDTO) {
        if (idPedido != pedidoDTO.getId()) {
            return ResponseEntity.badRequest().build();
        }
        PedidoDTO pedidoActualizado = pedidoService.update(idPedido, pedidoDTO);
        if (pedidoActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pedidoActualizado);
    }

    @DeleteMapping("/{idPedido}")
    public ResponseEntity<Void> delete(@PathVariable int idPedido) {
        boolean result = pedidoService.delete(idPedido);
        if (!result) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/cuenta")
    public ResponseEntity<Double> calcularTotalPlatosServidos(@PathVariable int id) {
        Double total = pedidoService.calcularTotalPlatosServidos(id);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/ventas/dia")
    public ResponseEntity<Double> calcularVentasDia() {
        Double total = pedidoService.calcularVentasDia();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/ventas/mes")
    public ResponseEntity<Double> calcularVentasMes() {
        Double total = pedidoService.calcularVentasMes();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/ventas/anio")
    public ResponseEntity<Double> calcularVentasAnio() {
        Double total = pedidoService.calcularVentasAnio();
        return ResponseEntity.ok(total);
    }
}