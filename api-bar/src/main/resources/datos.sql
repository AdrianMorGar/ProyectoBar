-- Usuarios
INSERT INTO usuario (nombre, contrasena, rol, habilitado)
VALUES 
('Carlos Dueño', '$2a$10$GbzETRtHuj9CEYyojYezme9bFz/jylV3veozh1cWNGQbn8GG0IAsS', 'DUEÑO', TRUE), -- 1234
('Ana Trabajadora', '$2a$10$RJ05KxE4fZDVA.PK6cEheuxNgnXW947H2aFINZgDJB.Nxu2ZBbFdO', 'TRABAJADOR', TRUE), -- trabajador123
('Juan Cocinero', '$2a$10$Kk6GVB51z6HVsgUHXXy0OeOISxxPmmV/LbmyDCZInJ/RnKXCaw70O', 'TRABAJADOR', TRUE), -- cocinero123
('Sofia Camarera', '$2a$10$hPsOGIyYfOCplW6pPGzx1.XCtCVWK8x/zjj7SbtC3937ndj.56Da2', 'TRABAJADOR', TRUE); -- camarera123

-- Tipos de platos
INSERT INTO tipo (nombre_tipo, imagen)
VALUES 
('Entrantes', ''),
('Principales', ''),
('Postres', ''),
('Bebidas', '');

-- Carta (menú)
INSERT INTO carta (nombre_plato, descripcion, precio, categoria, disponible, habilitado, imagen, tipo_id) VALUES
('Paella Valenciana', 'Arroz con pollo, conejo y verduras', 3.50, 'TAPA', TRUE, TRUE, '', 2),
('Paella Valenciana', 'Arroz con pollo, conejo y verduras', 7.00, 'MEDIA', TRUE, TRUE, '', 2),
('Paella Valenciana', 'Arroz con pollo, conejo y verduras', 12.00, 'PLATO', TRUE, TRUE, '', 2),
('Gazpacho Andaluz', 'Sopa fría de tomate, pimiento y pepino', 2.00, 'TAPA', TRUE, TRUE, '', 1),
('Gazpacho Andaluz', 'Sopa fría de tomate, pimiento y pepino', 4.00, 'MEDIA', TRUE, TRUE, '', 1),
('Tortilla Española', 'Tortilla de patatas y cebolla', 2.50, 'TAPA', TRUE, TRUE, '', 1),
('Tortilla Española', 'Tortilla de patatas y cebolla', 5.00, 'MEDIA', TRUE, TRUE, '', 1),
('Tortilla Española', 'Tortilla de patatas y cebolla', 8.00, 'PLATO', TRUE, TRUE, '', 1),
('Pulpo a la Gallega', 'Pulpo cocido con pimentón y aceite de oliva', 4.00, 'TAPA', TRUE, TRUE, '', 2),
('Pulpo a la Gallega', 'Pulpo cocido con pimentón y aceite de oliva', 8.00, 'MEDIA', TRUE, TRUE, '', 2),
('Pulpo a la Gallega', 'Pulpo cocido con pimentón y aceite de oliva', 14.00, 'PLATO', TRUE, TRUE, '', 2),
('Churros con Chocolate', 'Churros fritos con chocolate caliente', 3.00, 'MEDIA', TRUE, TRUE, '', 3),
('Sangría', 'Bebida tradicional con vino y frutas', 3.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Salmorejo Cordobés', 'Crema fría de tomate, pan, ajo y aceite de oliva', 2.20, 'TAPA', TRUE, TRUE, '', 1),
('Salmorejo Cordobés', 'Crema fría de tomate, pan, ajo y aceite de oliva', 4.50, 'MEDIA', TRUE, TRUE, '', 1),
('Croquetas Caseras', 'Croquetas de jamón ibérico', 2.00, 'TAPA', TRUE, TRUE, '', 1),
('Croquetas Caseras', 'Croquetas de jamón ibérico', 4.00, 'MEDIA', TRUE, TRUE, '', 1),
('Calamares a la Romana', 'Anillas de calamar rebozadas y fritas', 3.00, 'TAPA', TRUE, TRUE, '', 2),
('Calamares a la Romana', 'Anillas de calamar rebozadas y fritas', 6.00, 'MEDIA', TRUE, TRUE, '', 2),
('Calamares a la Romana', 'Anillas de calamar rebozadas y fritas', 10.00, 'PLATO', TRUE, TRUE, '', 2),
('Flan Casero', 'Flan de huevo con caramelo', 3.00, 'MEDIA', TRUE, TRUE, '', 3),
('Tarta de Queso', 'Tarta cremosa con base de galleta', 3.50, 'MEDIA', TRUE, TRUE, '', 3),
('Agua Mineral', 'Botella de agua mineral 50cl', 1.20, 'BEBIDA', TRUE, TRUE, '', 4),
('Cerveza Artesana', 'Cerveza rubia de elaboración artesanal', 3.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Tosta de Jamón y Tomate', 'Pan crujiente con tomate rallado y jamón ibérico', 2.50, 'TAPA', TRUE, TRUE, '', 1),
('Montadito de Lomo con Queso', 'Panecillo con lomo a la plancha y queso fundido', 2.80, 'TAPA', TRUE, TRUE, '', 1),
('Albóndigas en Salsa', 'Albóndigas caseras con salsa de tomate y especias', 3.00, 'TAPA', TRUE, TRUE, '', 2),
('Albóndigas en Salsa', 'Albóndigas caseras con salsa de tomate y especias', 6.00, 'MEDIA', TRUE, TRUE, '', 2),
('Pollo al Ajillo', 'Trozos de pollo fritos con ajo y vino blanco', 3.50, 'TAPA', TRUE, TRUE, '', 2),
('Pollo al Ajillo', 'Trozos de pollo fritos con ajo y vino blanco', 7.00, 'MEDIA', TRUE, TRUE, '', 2),
('Pisto Manchego', 'Salteado de verduras con tomate, cebolla y pimiento', 2.50, 'TAPA', TRUE, TRUE, '', 1),
('Pisto Manchego', 'Salteado de verduras con tomate, cebolla y pimiento', 5.00, 'MEDIA', TRUE, TRUE, '', 1),
('Queso Manchego Curado', 'Ración de queso curado con aceite de oliva', 3.00, 'TAPA', TRUE, TRUE, '', 1),
('Helado Artesano', 'Bola de helado artesanal (vainilla, chocolate o fresa)', 2.50, 'MEDIA', TRUE, TRUE, '', 3),
('Café Solo', 'Café expreso', 1.30, 'BEBIDA', TRUE, TRUE, '', 4),
('Café con Leche', 'Café con leche entera o semidesnatada', 1.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Refresco Cola', 'Lata de refresco sabor cola', 1.80, 'BEBIDA', TRUE, TRUE, '', 4),
('Zumo de Naranja Natural', 'Zumo exprimido al momento', 2.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Vino Tinto de la Casa', 'Copa de vino tinto de la región', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Vino Blanco Afrutado', 'Copa de vino blanco fresco y afrutado', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Fabada Asturiana', 'Guiso tradicional con fabes y embutidos', 4.00, 'TAPA', TRUE, TRUE, '', 2),
('Fabada Asturiana', 'Guiso tradicional con fabes y embutidos', 8.00, 'MEDIA', TRUE, TRUE, '', 2),
('Fabada Asturiana', 'Guiso tradicional con fabes y embutidos', 13.00, 'PLATO', TRUE, TRUE, '', 2),
('Cocido Madrileño', 'Plato completo con garbanzos, carne y verduras', 7.00, 'PLATO', TRUE, TRUE, '', 2),
('Ensaladilla Rusa', 'Patata, mayonesa, atún y verduras', 2.00, 'TAPA', TRUE, TRUE, '', 1),
('Ensaladilla Rusa', 'Patata, mayonesa, atún y verduras', 4.00, 'MEDIA', TRUE, TRUE, '', 1),
('Boquerones en Vinagre', 'Filetes de boquerón marinados con ajo y perejil', 2.50, 'TAPA', TRUE, TRUE, '', 2),
('Huevos Rotos con Jamón', 'Huevos fritos sobre patatas y jamón ibérico', 3.50, 'TAPA', TRUE, TRUE, '', 2),
('Huevos Rotos con Jamón', 'Huevos fritos sobre patatas y jamón ibérico', 6.50, 'MEDIA', TRUE, TRUE, '', 2),
('Empanada Gallega', 'Masa rellena de atún, tomate y pimiento', 2.50, 'TAPA', TRUE, TRUE, '', 1),
('Gambas al Ajillo', 'Gambas salteadas con ajo y guindilla', 4.00, 'TAPA', TRUE, TRUE, '', 2),
('Gambas al Ajillo', 'Gambas salteadas con ajo y guindilla', 7.00, 'MEDIA', TRUE, TRUE, '', 2),
('Tarta de Santiago', 'Tarta de almendra típica de Galicia', 3.50, 'MEDIA', TRUE, TRUE, '', 3),
('Cava Brut Nature', 'Copa de cava espumoso catalán', 2.80, 'BEBIDA', TRUE, TRUE, '', 4),
('Licor de Hierbas', 'Licor digestivo tradicional de Galicia', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Vermut Rojo', 'Vermut artesanal con toque cítrico', 2.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Tinto de Verano', 'Vino tinto con gaseosa y rodaja de limón', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Caña de Cerveza', 'Vaso pequeño de cerveza tirada', 1.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Jarra de Cerveza', 'Jarra grande de cerveza fría', 3.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Agua con Gas', 'Agua mineral con gas', 1.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Cubalibre', 'Ron con cola y hielo', 4.50, 'BEBIDA', TRUE, TRUE, '', 4),
('Cerveza Estrella Galicia', 'Cerveza rubia española, 33cl', 2.20, 'BEBIDA', TRUE, TRUE, '', 4),
('Cerveza Cruzcampo', 'Cerveza lager típica del sur, 33cl', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Cerveza Mahou 5 Estrellas', 'Cerveza rubia madrileña, 33cl', 2.10, 'BEBIDA', TRUE, TRUE, '', 4),
('Cerveza Alhambra Reserva 1925', 'Cerveza premium granadina, 33cl', 2.80, 'BEBIDA', TRUE, TRUE, '', 4),
('Refresco Limón', 'Lata de refresco sabor limón', 1.80, 'BEBIDA', TRUE, TRUE, '', 4),
('Refresco Naranja', 'Lata de refresco sabor naranja', 1.80, 'BEBIDA', TRUE, TRUE, '', 4),
('Tónica', 'Lata de tónica, ideal para combinados', 1.90, 'BEBIDA', TRUE, TRUE, '', 4),
('Nestea de Limón', 'Té frío con sabor a limón', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),
('Aquarius Limón', 'Bebida isotónica con sabor a limón', 2.00, 'BEBIDA', TRUE, TRUE, '', 4),

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

# spring.application.name=api-bar
# server.servlet.context-path=/bar/api

# spring.datasource.url=jdbc:mysql://sql.freedb.tech:3306/freedb_api_bar
# spring.datasource.username=freedb_amorgar2004
# spring.datasource.password=9VrAWV9fNEncF9%
# spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver # Usar driver MySQL para la mayoría de proveedores gratuitos

# spring.jpa.hibernate.ddl-auto=update
# spring.jpa.show-sql=true