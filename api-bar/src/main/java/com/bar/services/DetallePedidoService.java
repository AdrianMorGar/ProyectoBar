package com.bar.services;

import com.bar.persistence.entities.DetallePedido;
import com.bar.persistence.entities.Pedido;
import com.bar.persistence.entities.Plato;
import com.bar.persistence.entities.enums.Categoria;
import com.bar.persistence.entities.enums.EstadoPedido;
import com.bar.persistence.repositories.DetallePedidoRepository;
import com.bar.persistence.repositories.PedidoRepository;
import com.bar.persistence.repositories.PlatoRepository;
import com.bar.services.dtos.DetallePedidoInputDTO;
import com.bar.services.dtos.DetallePedidoOutputDTO;
import com.bar.services.mappers.DetallePedidoMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DetallePedidoService {

	@Autowired
	private DetallePedidoRepository detallePedidoRepository;

	@Autowired
	private PlatoRepository platoRepository;

	@Autowired
	private PedidoRepository pedidoRepository;

	public List<DetallePedidoOutputDTO> findAll() {
		return DetallePedidoMapper.toOutputDtos(detallePedidoRepository.findAll());
	}

	public DetallePedidoOutputDTO findById(int id) {
		DetallePedido detalle = detallePedidoRepository.findById(id).orElse(null);
		return detalle != null ? DetallePedidoMapper.toOutputDto(detalle) : null;
	}

	public DetallePedidoOutputDTO create(DetallePedidoInputDTO detalleDTO) {
		DetallePedido detalle = DetallePedidoMapper.toEntity(detalleDTO);

		Pedido pedido = pedidoRepository.findById(detalleDTO.getPedidoId()).orElse(null);
		if (pedido == null) {
			throw new RuntimeException("El pedido no existe");
		}

		Plato plato = platoRepository.findById(detalleDTO.getPlatoId()).orElse(null);
		if (plato == null) {
			throw new RuntimeException("El plato no existe");
		}

		detalle.setPedido(pedido);
		detalle.setPlato(plato);
		detalle.setEstado(EstadoPedido.PENDIENTE);

		pedido.getDetalles().add(detalle);

		DetallePedido savedDetalle = detallePedidoRepository.save(detalle);
		return DetallePedidoMapper.toOutputDto(savedDetalle);
	}

	public DetallePedidoOutputDTO update(int id, DetallePedidoInputDTO detalleDTO) {
		DetallePedido detalleExistente = detallePedidoRepository.findById(id).orElse(null);
		if (detalleExistente == null) {
			throw new RuntimeException("El detalle de este pedido no existe");
		}

		detalleExistente.setCantidad(detalleDTO.getCantidad());
		detalleExistente.setEstado(detalleDTO.getEstado());

		if (detalleDTO.getNotas() != null) {
			detalleExistente.setNotas(detalleDTO.getNotas());
		}

		DetallePedido updatedDetalle = detallePedidoRepository.save(detalleExistente);
		return DetallePedidoMapper.toOutputDto(updatedDetalle);
	}

	public boolean delete(int id) {
		if (detallePedidoRepository.existsById(id)) {
			detallePedidoRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public void cancelarPlato(int idDetallePedido) {
		DetallePedido detalle = detallePedidoRepository.findById(idDetallePedido).orElse(null);
		if (detalle == null) {
			throw new RuntimeException("El detalle de este pedido no existe");
		}
		detalle.setEstado(EstadoPedido.CANCELADO);
		detallePedidoRepository.save(detalle);
	}

	public void servirPlato(int idDetallePedido) {
		DetallePedido detalle = detallePedidoRepository.findById(idDetallePedido).orElse(null);
		if (detalle == null) {
			throw new RuntimeException("El detalle de este pedido no existe");
		}
		detalle.setEstado(EstadoPedido.SERVIDO);
		detallePedidoRepository.save(detalle);
	}

	public void pendientePlato(int idDetallePedido) {
		DetallePedido detalle = detallePedidoRepository.findById(idDetallePedido).orElse(null);
		if (detalle == null) {
			throw new RuntimeException("El detalle de este pedido no existe");
		}
		detalle.setEstado(EstadoPedido.PENDIENTE);
		detallePedidoRepository.save(detalle);
	}

	public void toggleEstadoPlato(int id) {
		DetallePedido detalle = detallePedidoRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("El detalle de este pedido no existe"));

		if (detalle.getEstado() == EstadoPedido.PENDIENTE) {
			detalle.setEstado(EstadoPedido.EN_PROCESO);
		} else if (detalle.getEstado() == EstadoPedido.EN_PROCESO) {
			detalle.setEstado(EstadoPedido.COMPLETADO);
		} else if (detalle.getEstado() == EstadoPedido.COMPLETADO) {
			detalle.setEstado(EstadoPedido.PENDIENTE);
		}

		detallePedidoRepository.save(detalle);
	}

	public List<Map<String, Object>> listarDetallesActivo() {
		List<DetallePedido> detalles = detallePedidoRepository.findAll().stream()
				.filter(detalle -> detalle.getEstado() != EstadoPedido.CANCELADO
						&& detalle.getEstado() != EstadoPedido.SERVIDO)
				.filter(detalle -> !Categoria.BEBIDA.equals(detalle.getPlato().getCategoria()))
				.filter(detalle -> detalle.getPedido() != null && Boolean.FALSE.equals(detalle.getPedido().getPagado()))
				.toList();

		Map<String, List<DetallePedido>> detallesPorIdentificador = detalles.stream()
				.collect(Collectors.groupingBy(detalle -> {
					Pedido pedido = detalle.getPedido();
					if (pedido.getMesa() != null) {
						return "Mesa " + pedido.getMesa();
					} else {
						return "Barra "
								+ (pedido.getNombreCliente() != null ? pedido.getNombreCliente() : "Desconocido");
					}
				}));

		List<Map<String, Object>> resultado = new ArrayList<>();
		for (Map.Entry<String, List<DetallePedido>> entry : detallesPorIdentificador.entrySet()) {
			String identificador = entry.getKey();
			List<DetallePedido> detallesLista = entry.getValue();

			List<DetallePedidoOutputDTO> detallesOrdenados = detallesLista.stream().sorted((d1, d2) -> {
				if (d1.getEstado() == EstadoPedido.EN_PROCESO && d2.getEstado() != EstadoPedido.EN_PROCESO)
					return -1;
				if (d1.getEstado() != EstadoPedido.EN_PROCESO && d2.getEstado() == EstadoPedido.EN_PROCESO)
					return 1;
				if (d1.getEstado() == EstadoPedido.PENDIENTE && d2.getEstado() == EstadoPedido.COMPLETADO)
					return -1;
				if (d1.getEstado() == EstadoPedido.COMPLETADO && d2.getEstado() == EstadoPedido.PENDIENTE)
					return 1;
				return 0;
			}).map(DetallePedidoMapper::toOutputDto).collect(Collectors.toList());

			Map<String, Object> mesaConDetalles = new HashMap<>();
			mesaConDetalles.put("mesa", identificador);
			mesaConDetalles.put("detalles", detallesOrdenados);
			mesaConDetalles.put("fechaPedido", detallesLista.stream().map(d -> d.getPedido().getFecha())
					.min(LocalDateTime::compareTo).orElse(LocalDateTime.now()));

			resultado.add(mesaConDetalles);
		}

		resultado.sort((m1, m2) -> {
			LocalDateTime f1 = (LocalDateTime) m1.get("fechaPedido");
			LocalDateTime f2 = (LocalDateTime) m2.get("fechaPedido");
			return f1.compareTo(f2);
		});

		resultado.forEach(m -> m.remove("fechaPedido"));

		return resultado;
	}

	public List<Map<String, Object>> listarBebidas() {
		List<DetallePedido> detalles = detallePedidoRepository.findAll().stream()
				.filter(detalle -> detalle.getEstado() == EstadoPedido.PENDIENTE && detalle.getPlato() != null
						&& Categoria.BEBIDA.equals(detalle.getPlato().getCategoria()) && detalle.getPedido() != null
						&& Boolean.FALSE.equals(detalle.getPedido().getPagado()))
				.toList();

		Map<String, List<DetallePedido>> detallesPorIdentificador = detalles.stream()
				.collect(Collectors.groupingBy(detalle -> {
					Pedido pedido = detalle.getPedido();
					if (pedido.getMesa() != null) {
						return "Mesa " + pedido.getMesa();
					} else {
						return "Barra "
								+ (pedido.getNombreCliente() != null ? pedido.getNombreCliente() : "Desconocido");
					}
				}));

		List<Map<String, Object>> resultado = new ArrayList<>();
		for (Map.Entry<String, List<DetallePedido>> entry : detallesPorIdentificador.entrySet()) {
			String identificador = entry.getKey();
			List<DetallePedido> detallesLista = entry.getValue();

			List<DetallePedidoOutputDTO> detallesDTO = new ArrayList<>();
			for (DetallePedido detalle : detallesLista) {
				detallesDTO.add(DetallePedidoMapper.toOutputDto(detalle));
			}

			Map<String, Object> grupo = new HashMap<>();
			grupo.put("mesa", identificador);
			grupo.put("detalles", detallesDTO);
			resultado.add(grupo);
		}

		return resultado;
	}

}
