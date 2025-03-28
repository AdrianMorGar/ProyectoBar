package com.bar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.persistence.repositories.PedidoRepository;
import com.bar.services.dtos.PedidoDTO;
import com.bar.services.mappers.PedidoMapper;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<PedidoDTO> listarPedidosActivos(Integer mesa, EstadoPedido estado) {
        List<Pedido> pedidos;
        if (mesa != null && estado != null) {
            pedidos = pedidoRepository.findByMesaAndEstado(mesa, estado);
        } else if (mesa != null) {
            pedidos = pedidoRepository.findByMesa(mesa);
        } else if (estado != null) {
            pedidos = pedidoRepository.findByEstado(estado);
        } else {
            pedidos = pedidoRepository.findAll();
        }
        return PedidoMapper.toDtos(pedidos);
    }

    public void actualizarEstadoPedido(Integer id, EstadoPedido estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(estado);
        pedidoRepository.save(pedido);
    }

    public void asignarMesa(Integer id, Integer mesa) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setMesa(mesa);
        pedidoRepository.save(pedido);
    }

    public Double calcularCuentaMesa(Integer numeroMesa) {
        List<Pedido> pedidos = pedidoRepository.findByMesa(numeroMesa);
        double total = 0.0;
        for (Pedido pedido : pedidos) {
            for (var detalle : pedido.getDetalles()) {
                total += detalle.getCantidad() * detalle.getPlato().getPrecio();
            }
        }
        return total;
    }
}