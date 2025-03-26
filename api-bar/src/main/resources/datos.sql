CREATE DATABASE bar;
USE bar;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    habilitado BOOLEAN DEFAULT TRUE,
    rol ENUM('dueño', 'trabajador') NOT NULL
);

CREATE TABLE plato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT NOT NULL,
    nombre_plato VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(8, 2) NOT NULL,
    categoria ENUM('Tapa', 'Media', 'Plato', 'Bebida') NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    habilitado BOOLEAN DEFAULT TRUE,
    imagen VARCHAR(255),
    FOREIGN KEY (tipo_id) REFERENCES tipo(id)
);

CREATE TABLE tipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
	nombre_cliente VARCHAR(255),
    mesa INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'En proceso', 'Servido', 'Cancelado') DEFAULT 'Pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    plato_id INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (plato_id) REFERENCES carta(id)
);