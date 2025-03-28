package com.bar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.repositories.DetallePedidoRepository;
import com.bar.services.dtos.DetallePedidoDTO;
import com.bar.services.mappers.DetallePedidoMapper;

import java.util.List;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public List<DetallePedidoDTO> listarDetallesPorPedido(Integer pedidoId) {
        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedidoId);
        return DetallePedidoMapper.toDtos(detalles);
    }

    public DetallePedidoDTO create(DetallePedidoDTO detalleDTO) {
        DetallePedido detalle = DetallePedidoMapper.toEntity(detalleDTO);
        DetallePedido saved = detallePedidoRepository.save(detalle);
        return DetallePedidoMapper.toDto(saved);
    }

    public DetallePedidoDTO update(Integer id, DetallePedidoDTO detalleDTO) {
        DetallePedido detalle = DetallePedidoMapper.toEntity(detalleDTO);
        detalle.setId(id);
        DetallePedido updated = detallePedidoRepository.save(detalle);
        return DetallePedidoMapper.toDto(updated);
    }

    public boolean delete(Integer id) {
        if (detallePedidoRepository.existsById(id)) {
            detallePedidoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}