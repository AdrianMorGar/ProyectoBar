package com.bar.services;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.Usuario; // AÑADIDO
import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.persistence.repositories.PedidoRepository;
import com.bar.persistence.repositories.UsuarioRepository; // AÑADIDO
import com.bar.services.dtos.PedidoDTO;
import com.bar.services.dtos.PedidoVentaDTO;
import com.bar.services.mappers.PedidoMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

	@Autowired
	private PedidoRepository pedidoRepository;
	
	// AÑADIDO: Inyectamos el repositorio de usuarios para poder buscar al usuario.
	@Autowired
	private UsuarioRepository usuarioRepository;

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

	// MÉTODO CREATE MODIFICADO
	public PedidoDTO create(PedidoDTO pedidoDTO) {
	    Pedido pedido = PedidoMapper.toEntity(pedidoDTO);
	    pedido.setFecha(LocalDateTime.now());
	    pedido.setPagado(false);

	    // LÓGICA AÑADIDA PARA ASIGNAR EL USUARIO
	    if (pedidoDTO.getUsuarioId() == null) {
	        throw new RuntimeException("El ID del usuario es obligatorio para crear un pedido.");
	    }
	    
	    Usuario usuario = usuarioRepository.findById(pedidoDTO.getUsuarioId())
	        .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + pedidoDTO.getUsuarioId()));
	    
	    pedido.setUsuario(usuario); // Asignamos la entidad Usuario completa al pedido.

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
				if (detalle.getEstado() != null && detalle.getPlato() != null && detalle.getEstado() != EstadoPedido.CANCELADO) {
					total += detalle.getCantidad() * detalle.getPlato().getPrecio();
				}
			}
		}
		return total;
	}

	public List<PedidoVentaDTO> obtenerDetallesVentasDiarias(int year, int month, int day) {
		LocalDateTime startOfDay = LocalDateTime.of(year, month, day, 0, 0, 0);
		LocalDateTime endOfDay = LocalDateTime.of(year, month, day, 23, 59, 59);

		List<Pedido> pedidos = pedidoRepository.findByFechaBetween(startOfDay, endOfDay);
		List<PedidoVentaDTO> pedidosFiltrados = new ArrayList<>();
		for (Pedido pedido : pedidos) {
			if (pedido.getPagado()) {
				PedidoVentaDTO dto = PedidoMapper.toPedidoVentaDTO(pedido);
				pedidosFiltrados.add(dto);
			}
		}

		return pedidosFiltrados;
	}

	public Map<Integer, Double> calcularVentasDia(int year, int month) {
		Map<Integer, Double> ventasPorDia = new HashMap<>();
		LocalDate startDate = LocalDate.of(year, month, 1);
		LocalDate endDate = startDate.plusMonths(1).minusDays(1);

		List<Pedido> pedidos = pedidoRepository.findByFechaBetween(startDate.atStartOfDay(),
				endDate.plusDays(1).atStartOfDay());

		for (int day = 1; day <= endDate.getDayOfMonth(); day++) {
			double total = 0.0;
			for (Pedido pedido : pedidos) {
				if (pedido.getPagado() && pedido.getFecha().getDayOfMonth() == day) {
					total += PedidoMapper.toDto(pedido).getTotal();
				}
			}
			ventasPorDia.put(day, total);
		}

		return ventasPorDia;
	}

	public Map<Integer, Double> calcularVentasMes(int year) {
		Map<Integer, Double> ventasPorMes = new HashMap<>();
		LocalDate startDate = LocalDate.of(year, 1, 1);
		LocalDate endDate = LocalDate.of(year, 12, 31);

		List<Pedido> pedidos = pedidoRepository.findByFechaBetween(startDate.atStartOfDay(),
				endDate.plusDays(1).atStartOfDay());
		for (int month = 1; month <= 12; month++) {
			double total = 0.0;
			for (Pedido pedido : pedidos) {
				if (pedido.getPagado() && pedido.getFecha().getMonthValue() == month) {
					total += PedidoMapper.toDto(pedido).getTotal();
				}
			}
			ventasPorMes.put(month, total);
		}

		return ventasPorMes;
	}
	
	public List<PedidoDTO> fetchActiveOrdersForTable(int mesa) {
	    List<Pedido> pedidos = pedidoRepository.findByMesaAndPagadoFalse(mesa);
	    return PedidoMapper.toDtos(pedidos);
	}
	
	public List<PedidoDTO> findPedidos() {
	    List<Pedido> pedidos = pedidoRepository.findAll();
	    List<PedidoDTO> resultado = new ArrayList<>();
	    for (Pedido pedido : pedidos) {
	        boolean tieneActivos = false;
	        if (pedido.getDetalles() != null) {
	            for (DetallePedido detalle : pedido.getDetalles()) {
	                if (detalle.getEstado() != EstadoPedido.CANCELADO) {
	                    tieneActivos = true;
	                    break;
	                }
	            }
	        }

	        if (tieneActivos) {
	            resultado.add(PedidoMapper.toDtoFiltrado(pedido));
	        }
	    }

	    return resultado;
	}
}