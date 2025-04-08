package com.bar.services;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.persistence.repositories.PedidoRepository;
import com.bar.services.dtos.PedidoDTO;
import com.bar.services.mappers.PedidoMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<PedidoDTO> findAll() {
        return PedidoMapper.toDtos(pedidoRepository.findAll());
    }

    public boolean existsPedido(int idPedido) {
        return pedidoRepository.existsById(idPedido);
    }

    public PedidoDTO findById(int idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido).orElse(null);
        return pedido != null ? PedidoMapper.toDto(pedido) : null;
    }

    public PedidoDTO create(PedidoDTO pedidoDTO) {
        Pedido pedido = PedidoMapper.toEntity(pedidoDTO);
        Pedido savedPedido = pedidoRepository.save(pedido);
        return PedidoMapper.toDto(savedPedido);
    }

    public PedidoDTO update(int id, PedidoDTO pedidoDTO) {
        Pedido pedidoExistente = pedidoRepository.findById(id).orElse(null);
        if (pedidoExistente == null) {
            throw new RuntimeException("El pedido no existe");
        }

        pedidoExistente.setNombreCliente(pedidoDTO.getNombreCliente());
        pedidoExistente.setMesa(pedidoDTO.getMesa());
        pedidoExistente.setPagado(pedidoDTO.getPagado());

        Pedido updatedPedido = pedidoRepository.save(pedidoExistente);
        return PedidoMapper.toDto(updatedPedido);
    }

    public boolean delete(int idPedido) {
        if (pedidoRepository.existsById(idPedido)) {
            pedidoRepository.deleteById(idPedido);
            return true;
        }
        return false;
    }

    public Double calcularTotalPlatosServidos(int idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido).orElse(null);
        if (pedido == null) {
            throw new RuntimeException("El pedido con no existe");
        }

        double total = 0.0;
        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getEstado() != null && detalle.getPlato() != null) {
                    total += detalle.getCantidad() * detalle.getPlato().getPrecio();
                }
            }
        }
        return total;
    }

    public Double calcularVentasDia() {
        LocalDate hoy = LocalDate.now();
        List<Pedido> pedidos = pedidoRepository.findByFechaBetween(hoy.atStartOfDay(), hoy.plusDays(1).atStartOfDay());
        return calcularTotalVentas(pedidos);
    }

    public Double calcularVentasMes() {
        LocalDate hoy = LocalDate.now();
        List<Pedido> pedidos = pedidoRepository.findByFechaBetween(
                hoy.withDayOfMonth(1).atStartOfDay(),
                hoy.plusMonths(1).withDayOfMonth(1).atStartOfDay()
        );
        return calcularTotalVentas(pedidos);
    }

    public Double calcularVentasAnio() {
        LocalDate hoy = LocalDate.now();
        List<Pedido> pedidos = pedidoRepository.findByFechaBetween(
                hoy.withDayOfYear(1).atStartOfDay(),
                hoy.plusYears(1).withDayOfYear(1).atStartOfDay()
        );
        return calcularTotalVentas(pedidos);
    }

    private Double calcularTotalVentas(List<Pedido> pedidos) {
        double total = 0.0;
        for (Pedido pedido : pedidos) {
            if (pedido.getPagado()) {
                total += PedidoMapper.toDto(pedido).getTotal();
            }
        }
        return total;
    }
    
    
}