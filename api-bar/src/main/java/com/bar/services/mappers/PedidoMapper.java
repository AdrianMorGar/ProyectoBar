package com.bar.services.mappers;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.services.dtos.DetalleVentaDTO;
import com.bar.services.dtos.PedidoDTO;
import com.bar.services.dtos.PedidoVentaDTO;

import java.util.ArrayList;
import java.util.List;

public class PedidoMapper {

    public static PedidoDTO toDto(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setNombreCliente(pedido.getNombreCliente());
        dto.setMesa(pedido.getMesa());
        dto.setFecha(pedido.getFecha());
        dto.setPagado(pedido.getPagado());
        
        if (pedido.getUsuario() != null) {
            dto.setUsuarioId(pedido.getUsuario().getId());
        }

        double total = 0.0;
        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getEstado() != EstadoPedido.CANCELADO && detalle.getPlato() != null) {
                    total += detalle.getCantidad() * detalle.getPlato().getPrecio();
                }
            }
        }
        dto.setTotal(total);

        if (pedido.getDetalles() != null) {
            dto.setDetalles(DetallePedidoMapper.toOutputDtos(pedido.getDetalles()));
        } else {
            dto.setDetalles(new ArrayList<>());
        }

        return dto;
    }

    public static Pedido toEntity(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setNombreCliente(dto.getNombreCliente());
        pedido.setMesa(dto.getMesa());
        pedido.setFecha(dto.getFecha());
        pedido.setPagado(dto.getPagado());
        return pedido;
    }

    public static List<PedidoDTO> toDtos(List<Pedido> pedidos) {
        List<PedidoDTO> pedidoDTOs = new ArrayList<>();
        for (Pedido p : pedidos) {
            pedidoDTOs.add(toDto(p));
        }
        return pedidoDTOs;
    }

    public static PedidoVentaDTO toPedidoVentaDTO(Pedido pedido) {
        PedidoVentaDTO dto = new PedidoVentaDTO();
        dto.setId(pedido.getId());

        // Total del pedido
        double total = 0.0;
        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getEstado() != EstadoPedido.CANCELADO && detalle.getPlato() != null) {
                    total += detalle.getCantidad() * detalle.getPlato().getPrecio();
                }
            }
        }
        dto.setTotal(total);

        // Detalles individuales
        List<DetalleVentaDTO> detallesDTO = new ArrayList<>();
        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getEstado() != EstadoPedido.CANCELADO && detalle.getPlato() != null) {
                    DetalleVentaDTO detalleDTO = new DetalleVentaDTO();
                    detalleDTO.setId(detalle.getId());
                    detalleDTO.setCantidad(detalle.getCantidad());
                    detalleDTO.setPrecioUnitario(detalle.getPlato().getPrecio());
                    detalleDTO.setPlato(detalle.getPlato().getNombrePlato());
                    detallesDTO.add(detalleDTO);
                }
            }
        }
        dto.setDetalles(detallesDTO);
        dto.setMesa(pedido.getMesa());
        dto.setNombreCliente(pedido.getNombreCliente());

        if (pedido.getUsuario() != null) {
            dto.setTrabajador(pedido.getUsuario().getNombre());
        } else {
            dto.setTrabajador("Desconocido");
        }

        return dto;
    }


    public static List<PedidoVentaDTO> toPedidoVentaDTOs(List<Pedido> pedidos) {
        List<PedidoVentaDTO> resultado = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            resultado.add(toPedidoVentaDTO(pedido));
        }
        return resultado;
    }
    
    public static PedidoDTO toDtoFiltrado(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setNombreCliente(pedido.getNombreCliente());
        dto.setMesa(pedido.getMesa());
        dto.setFecha(pedido.getFecha());
        dto.setPagado(pedido.getPagado());

        double total = 0.0;
        List<DetallePedido> detallesValidos = new ArrayList<>();

        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getEstado() != EstadoPedido.CANCELADO) {
                    detallesValidos.add(detalle);
                    if (detalle.getPlato() != null) {
                        total += detalle.getCantidad() * detalle.getPlato().getPrecio();
                    }
                }
            }
        }

        dto.setTotal(total);
        dto.setDetalles(DetallePedidoMapper.toOutputDtos(detallesValidos));

        return dto;
    }

}