package com.bar.persistence.entities;

import java.util.List;

import com.bar.persistence.entities.enums.Categoria;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "carta")
@Getter
@Setter
@NoArgsConstructor
public class Plato {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "nombre_plato", length = 255, nullable = false)
	private String nombrePlato;

	private String descripcion;

	@Column(columnDefinition = "DECIMAL(8,2)", nullable = false)
	private Double precio;

	@Enumerated(EnumType.STRING)
	private Categoria categoria;

	private Boolean disponible;
	private Boolean habilitado;

	@Column(columnDefinition = "LONGTEXT")
	private String imagen;

	@OneToMany(mappedBy = "plato")
	@JsonIgnore
	private List<DetallePedido> detalles;

	@ManyToOne
	@JoinColumn(name = "tipo_id", referencedColumnName = "id")
	private Tipo tipo;
}
