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
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(request -> {
			CorsConfiguration config = new CorsConfiguration();
			config.setAllowedOrigins(List.of("http://pruebaamg.com", "http://localhost:3000"));
			config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
			config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "accept", "Origin",
					"Access-Control-Request-Method", "Access-Control-Request-Headers"));
			config.setExposedHeaders(List.of("Authorization"));
			config.setAllowCredentials(true);
			return config;
		}));

		http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(authz -> authz.requestMatchers("/auth/login").permitAll()
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

						.requestMatchers(HttpMethod.GET, "/platos", "/platos/**", "/platos/buscar").permitAll()

						.requestMatchers(HttpMethod.POST, "/platos").hasRole("DUENO")
						.requestMatchers(HttpMethod.PUT, "/platos/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.PATCH, "/platos/{dishId}/toggle/habilitado").hasRole("DUENO")
						.requestMatchers(HttpMethod.PATCH, "/platos/{dishId}/toggle/Disponible").hasRole("DUENO")

						.requestMatchers(HttpMethod.GET, "/tipos", "/tipos/**").permitAll()

						.requestMatchers(HttpMethod.POST, "/tipos").hasRole("DUENO")
						.requestMatchers(HttpMethod.PUT, "/tipos/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.DELETE, "/tipos/**").hasRole("DUENO")

						.requestMatchers(HttpMethod.GET, "/usuarios", "/usuarios/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.POST, "/usuarios").hasRole("DUENO")
						.requestMatchers(HttpMethod.PUT, "/usuarios/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.PUT, "/usuarios/{userId}/password").hasAnyRole("DUENO")

						.requestMatchers(HttpMethod.GET, "/pedidos", "/pedidos/**").hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.POST, "/pedidos").hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.PUT, "/pedidos/**").hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.GET, "/pedidos/{orderId}/cuenta").hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.DELETE, "/pedidos/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.GET, "/pedidos/ventas/**").hasRole("DUENO")
						.requestMatchers(HttpMethod.GET, "/pedidos/activos/**").hasAnyRole("DUENO", "TRABAJADOR")

						.requestMatchers(HttpMethod.GET, "/detalles-pedido", "/detalles-pedido/**")
						.hasAnyRole("DUENO", "TRABAJADOR").requestMatchers(HttpMethod.POST, "/detalles-pedido")
						.hasAnyRole("DUENO", "TRABAJADOR").requestMatchers(HttpMethod.PUT, "/detalles-pedido/**")
						.hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/cancelar")
						.hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/pendiente")
						.hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/servir")
						.hasAnyRole("DUENO", "TRABAJADOR")
						.requestMatchers(HttpMethod.PATCH, "/detalles-pedido/{detailId}/toggle-estado")
						.hasAnyRole("DUENO", "TRABAJADOR").requestMatchers(HttpMethod.DELETE, "/detalles-pedido/**")
						.hasAnyRole("DUENO", "TRABAJADOR").requestMatchers(HttpMethod.GET, "/detalles-pedido/activo")
						.hasAnyRole("DUENO", "TRABAJADOR").requestMatchers(HttpMethod.GET, "/detalles-pedido/bebidas")
						.hasAnyRole("DUENO", "TRABAJADOR")

						.anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}