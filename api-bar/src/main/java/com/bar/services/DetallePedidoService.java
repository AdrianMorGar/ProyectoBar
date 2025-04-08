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

import java.util.LinkedHashMap;
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
		DetallePedido detalle = detallePedidoRepository.findById(id).orElse(null);
		if (detalle == null) {
			throw new RuntimeException("El detalle de este pedido no existe");
		}

		if (detalle.getEstado() == EstadoPedido.SERVIDO || detalle.getEstado() == EstadoPedido.CANCELADO) {
			throw new RuntimeException("No se puede alternar el estado de un plato ya servido o cancelado");
		}

		if (detalle.getEstado() == EstadoPedido.PENDIENTE) {
			detalle.setEstado(EstadoPedido.EN_PROCESO);
		} else if (detalle.getEstado() == EstadoPedido.EN_PROCESO) {
			detalle.setEstado(EstadoPedido.PENDIENTE);
		}

		detallePedidoRepository.save(detalle);
	}

	public Map<Integer, List<DetallePedidoOutputDTO>> listarDetallesActivo() {
		List<DetallePedido> detalles = detallePedidoRepository.findAll().stream()
				.filter(detalle -> detalle.getEstado() != EstadoPedido.CANCELADO && detalle.getEstado() != EstadoPedido.SERVIDO)
				.filter(detalle -> !Categoria.BEBIDA.equals(detalle.getPlato().getCategoria())).toList();

		return detalles.stream().map(DetallePedidoMapper::toOutputDto).collect(Collectors.groupingBy(
				dto -> dto.getMesa(), LinkedHashMap::new, Collectors.collectingAndThen(Collectors.toList(), lista -> {
					lista.sort((d1, d2) -> {
						if (d1.getEstado() == EstadoPedido.EN_PROCESO && d2.getEstado() != EstadoPedido.EN_PROCESO) {
							return -1;
						} else if (d1.getEstado() != EstadoPedido.EN_PROCESO
								&& d2.getEstado() == EstadoPedido.EN_PROCESO) {
							return 1;
						}
						return 0;
					});
					return lista;
				})));
	}
}
