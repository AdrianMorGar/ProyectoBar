package com.bar.web.controllers;

import com.bar.services.PedidoService;
import com.bar.services.dtos.PedidoDTO;
import com.bar.services.dtos.PedidoVentaDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
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
    
    @GetMapping("/ventas/detalles/{year}/{month}/{day}")
    public ResponseEntity<List<PedidoVentaDTO>> obtenerDetallesVentasDiarias(@PathVariable int year, @PathVariable int month, @PathVariable int day) {
    	if (day < 1 || day > 31 || month < 1 || month > 12 || year < 0) {
            return ResponseEntity.badRequest().body(null);
        }
        List<PedidoVentaDTO> detalles = pedidoService.obtenerDetallesVentasDiarias(year, month, day);
        return ResponseEntity.ok(detalles);
    }

    @GetMapping("/ventas/mes/{year}/{month}")
    public ResponseEntity<Map<Integer, Double>> calcularVentasPorDia(@PathVariable int year, @PathVariable int month) {
        if (month < 1 || month > 12 || year < 0) {
            return ResponseEntity.badRequest().body(null);
        }
        Map<Integer, Double> ventasPorDia = pedidoService.calcularVentasDia(year, month);
        return ResponseEntity.ok(ventasPorDia);
    }

    @GetMapping("/ventas/anio/{year}")
    public ResponseEntity<Map<Integer, Double>> calcularVentasPorMes(@PathVariable int year) {
    	if (year < 0) {
            return ResponseEntity.badRequest().body(null);
        }
        Map<Integer, Double> ventasPorMes = pedidoService.calcularVentasMes(year);
        return ResponseEntity.ok(ventasPorMes);
    }
    
    @GetMapping("/activos/{mesa}")
    public ResponseEntity<List<PedidoDTO>> fetchActiveOrdersForTable(@PathVariable int mesa) {
        List<PedidoDTO> pedidosActivos = pedidoService.fetchActiveOrdersForTable(mesa);
        return ResponseEntity.ok(pedidosActivos);
    }
    
    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoDTO>> findPedidos() {
        return ResponseEntity.ok(pedidoService.findPedidos());
    }

}