-- Usuarios
INSERT INTO usuario (nombre, contrasena, rol, habilitado)
VALUES 
('Carlos Dueño', 'dueno123', 'DUEÑO', TRUE),
('Ana Trabajadora', 'trabajador123', 'TRABAJADOR', TRUE),
('Juan Cocinero', 'cocinero123', 'TRABAJADOR', TRUE),
('Sofia Camarera', 'camarera123', 'TRABAJADOR', TRUE);

-- Tipos de platos
INSERT INTO tipo (nombre_tipo)
VALUES 
('Entrantes'),
('Principales'),
('Postres'),
('Bebidas');

-- Carta (menú)
INSERT INTO carta (nombre_plato, descripcion, precio, categoria, disponible, habilitado, imagen, tipo_id)
VALUES 
('Ensalada César', 'Ensalada fresca con pollo a la plancha', 12.50, 'MEDIA', TRUE, TRUE, 'ensalada.jpg', 1),
('Filete de Res', 'Filete jugoso con guarnición', 25.00, 'PLATO', TRUE, TRUE, 'filete.jpg', 2),
('Tarta de Queso', 'Tarta casera con frutos rojos', 8.00, 'MEDIA', TRUE, TRUE, 'tarta.jpg', 3),
('Agua Mineral', 'Botella de agua mineral 500ml', 2.00, 'BEBIDA', TRUE, TRUE, 'agua.jpg', 4),
('Nachos con Queso', 'Nachos crujientes con queso fundido', 10.00, 'TAPA', TRUE, TRUE, 'nachos.jpg', 1),
('Pollo al Curry', 'Pollo cocinado en salsa de curry', 18.00, 'PLATO', TRUE, TRUE, 'curry.jpg', 2),
('Helado de Vainilla', 'Helado artesanal de vainilla', 6.00, 'MEDIA', TRUE, TRUE, 'helado.jpg', 3),
('Cerveza Artesanal', 'Cerveza local artesanal', 5.00, 'BEBIDA', TRUE, TRUE, 'cerveza.jpg', 4);

-- Pedidos
INSERT INTO pedido (nombre_cliente, mesa, fecha, pagado, usuario_id)
VALUES 
('Pedro Gomez', 5, '2023-10-01 12:30:00', FALSE, 2),
('Maria Lopez', 3, '2023-10-01 13:00:00', TRUE, 3),
('Luis Fernandez', 7, '2023-10-01 14:15:00', FALSE, 4),
('Elena Martinez', 2, '2023-10-01 19:30:00', TRUE, 2);

-- Detalles de pedidos con notas
INSERT INTO detalle_pedido (cantidad, estado, pedido_id, plato_id, notas)
VALUES 
(2, 'PENDIENTE', 1, 1, 'Sin aderezo'), -- Ensalada César para el pedido 1
(1, 'PENDIENTE', 1, 2, 'Bien cocido'), -- Filete de Res para el pedido 1
(3, 'SERVIDO', 2, 3, NULL),            -- Tarta de Queso para el pedido 2
(2, 'CANCELADO', 2, 4, 'Sin gas'),     -- Agua Mineral para el pedido 2
(1, 'EN_PROCESO', 3, 5, 'Extra queso'),-- Nachos con Queso para el pedido 3
(2, 'PENDIENTE', 3, 6, NULL),          -- Pollo al Curry para el pedido 3
(1, 'SERVIDO', 4, 7, 'Con chocolate'), -- Helado de Vainilla para el pedido 4
(4, 'PENDIENTE', 4, 8, NULL);          -- Cerveza Artesanal para el pedido 4