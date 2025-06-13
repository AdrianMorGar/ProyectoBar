package com.bar.web.config.jwt;

import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import com.bar.persistence.entities.Usuario;

@Component
public class JwtUtils {

	@Value("${jwt.secret.key}")
	private String secretKey;

	@Value("${jwt.time.expiration}")
	private String timeExpiration;

	public String createToken(Authentication authentication) {
		Usuario usuario = (Usuario) authentication.getPrincipal();
		String username = usuario.getUsername();

		Algorithm algorithm = Algorithm.HMAC256(this.secretKey);
		return JWT.create().withIssuer("api-bar").withSubject(username).withIssuedAt(new Date())
				.withExpiresAt(new Date(System.currentTimeMillis() + Long.parseLong(timeExpiration))).sign(algorithm);
	}

	public DecodedJWT validateToken(String token) throws JWTVerificationException {
		Algorithm algorithm = Algorithm.HMAC256(this.secretKey);
		JWTVerifier verifier = JWT.require(algorithm).withIssuer("api-bar").build();
		return verifier.verify(token);
	}

	public String getUsernameFromToken(DecodedJWT decodedJWT) {
		return decodedJWT.getSubject();
	}
}
