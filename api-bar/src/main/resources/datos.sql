INSERT INTO usuario (nombre, contrasena, rol, habilitado) VALUES 
('Juan Perez', 'password123', 'DUENO', TRUE),
('Maria Lopez', 'securepass', 'TRABAJADOR', TRUE),
('Carlos Gomez', 'mypassword', 'TRABAJADOR', FALSE);

INSERT INTO tipo (nombre_tipo) VALUES 
('Entrantes'),
('Principales'),
('Postres'),
('Bebidas');

INSERT INTO carta (nombre_plato, descripcion, precio, categoria, disponible, habilitado, imagen, tipo_id) VALUES 
('Ensalada César', 'Ensalada fresca con pollo a la plancha', 12.50, 'MEDIA', TRUE, TRUE, 'ensalada_cesar.jpg', 1),
('Filete de Res', 'Filete jugoso acompañado de papas al horno', 25.00, 'PLATO', TRUE, TRUE, 'filete_res.jpg', 2),
('Tarta de Chocolate', 'Deliciosa tarta de chocolate con crema', 8.00, 'PLATO', TRUE, TRUE, 'tarta_chocolate.jpg', 3),
('Coca-Cola', 'Refresco de cola de 330ml', 2.50, 'BEBIDA', TRUE, TRUE, 'cocacola.jpg', 4);

INSERT INTO pedido (nombre_cliente, mesa, fecha, estado, usuario_id) VALUES 
('Ana Martinez', 5, '2023-10-01 12:30:00', 'PENDIENTE', 1),
('Luis Ramirez', 3, '2023-10-01 13:00:00', 'EN_PROCESO', 2),
('Sofia Torres', 7, '2023-10-01 14:00:00', 'SERVIDO', 2);

INSERT INTO detalle_pedido (pedido_id, plato_id, cantidad) VALUES 
(1, 1, 2), -- Pedido 1: 2 Ensaladas César
(1, 2, 1), -- Pedido 1: 1 Filete de Res
(2, 3, 3), -- Pedido 2: 3 Tartas de Chocolate
(3, 4, 4); -- Pedido 3: 4 Coca-Colas