package com.bar.web.controllers;

import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.services.PedidoService;
import com.bar.services.dtos.PedidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listarPedidos(@RequestParam(required = false) Integer mesa, @RequestParam(required = false) EstadoPedido estado) {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosActivos(mesa, estado);
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> actualizarEstadoPedido(@PathVariable Integer id, @RequestBody EstadoPedido estado) {
        pedidoService.actualizarEstadoPedido(id, estado);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/asignar-mesa")
    public ResponseEntity<Void> asignarMesa(@PathVariable Integer id, @RequestBody Integer mesa) {
        pedidoService.asignarMesa(id, mesa);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mesas/{numero}/cuenta")
    public ResponseEntity<Double> calcularCuentaMesa(@PathVariable Integer numero) {
        Double total = pedidoService.calcularCuentaMesa(numero);
        return ResponseEntity.ok(total);
    }
}