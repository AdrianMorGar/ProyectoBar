package com.bar.web.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.bar.web.config.jwt.JwtRequestFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

 @Autowired
 private JwtRequestFilter jwtRequestFilter;

 @Bean
 public PasswordEncoder passwordEncoder() {
     return new BCryptPasswordEncoder();
 }

 @Bean
 public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
     return authenticationConfiguration.getAuthenticationManager();
 }
 
 @Bean
 public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
     // 🔐 CORS GLOBAL
     http.cors(cors -> cors.configurationSource(request -> {
         CorsConfiguration config = new CorsConfiguration();
         config.setAllowedOrigins(List.of("http://pruebaamg.com", "http://localhost:3000")); // 👈 Ajusta si tu frontend usa otro puerto
         config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
         config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
         config.setExposedHeaders(List.of("Authorization")); // 👈 MUY IMPORTANTE
         config.setAllowCredentials(true); // Si necesitas enviar cookies (no es obligatorio para JWT)
         return config;
     }));

     http
         .csrf(csrf -> csrf.disable())
         .authorizeHttpRequests(authz -> authz
        		 .requestMatchers("/auth/login").permitAll() // Login para todos
                 // Swagger UI (si lo usas)
                 .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                 // --- Platos (Carta visible para todos) ---
                 // Permite a CUALQUIERA (sin token) obtener la lista de platos, detalles de un plato y buscar platos.
                 .requestMatchers(HttpMethod.GET, "/platos", "/platos/**", "/platos/buscar").permitAll()
                 // Solo DUENO puede crear, modificar y gestionar disponibilidad/habilitación de platos
                 .requestMatchers(HttpMethod.POST, "/platos").hasRole("DUENO")
                 .requestMatchers(HttpMethod.PUT, "/platos/**").hasRole("DUENO")
                 .requestMatchers(HttpMethod.PATCH, "/platos/{dishId}/toggle/habilitado").hasRole("DUENO")
                 .requestMatchers(HttpMethod.PATCH, "/platos/{dishId}/toggle/Disponible").hasRole("DUENO")

                 // --- Tipos de Platos (Visible para todos) ---
                 // Permite a CUALQUIERA (sin token) obtener la lista de tipos y detalles de un tipo.
                 .requestMatchers(HttpMethod.GET, "/tipos", "/tipos/**").permitAll()
                 // Solo DUENO puede crear, modificar y eliminar tipos de platos
                 .requestMatchers(HttpMethod.POST, "/tipos").hasRole("DUENO")
                 .requestMatchers(HttpMethod.PUT, "/tipos/**").hasRole("DUENO")
                 .requestMatchers(HttpMethod.DELETE, "/tipos/**").hasRole("DUENO")


                 // --- Usuarios ---
                 .requestMatchers(HttpMethod.GET, "/usuarios", "/usuarios/**").hasRole("DUENO")
                 .requestMatchers(HttpMethod.POST, "/usuarios").hasRole("DUENO")
                 .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasRole("DUENO") // Cubre /usuarios/{id} y /usuarios/{id}/toggle
                 .requestMatchers(HttpMethod.PUT, "/usuarios/{userId}/password").hasAnyRole("DUENO", "TRABAJADOR")


                 // --- Pedidos ---
                 .requestMatchers(HttpMethod.GET, "/pedidos", "/pedidos/**").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.POST, "/pedidos").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PUT, "/pedidos/**").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.GET, "/pedidos/{orderId}/cuenta").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.DELETE, "/pedidos/**").hasRole("DUENO")
                 .requestMatchers(HttpMethod.GET, "/pedidos/ventas/**").hasRole("DUENO")
                 .requestMatchers(HttpMethod.GET, "/pedidos/activos/**").hasAnyRole("DUENO", "TRABAJADOR")


                 // --- Detalles de Pedidos ---
                 .requestMatchers(HttpMethod.GET, "/detalles-pedido", "/detalles-pedido/**").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.POST, "/detalles-pedido").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PUT, "/detalles-pedido/**").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/cancelar").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/pendiente").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/servir").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/toggle-estado").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.DELETE, "/detalles-pedido/**").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.GET, "/detalles-pedido/activo").hasAnyRole("DUENO", "TRABAJADOR")
                 .requestMatchers(HttpMethod.GET, "/detalles-pedido/bebidas").hasAnyRole("DUENO", "TRABAJADOR")


                 .anyRequest().authenticated() // Todas las demás peticiones requieren autenticación
         )
         .sessionManagement(session -> session
             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
         );

     http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

     return http.build();
 }
}