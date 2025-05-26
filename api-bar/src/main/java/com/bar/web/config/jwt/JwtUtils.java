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

import com.bar.persistence.entities.Usuario; // Assuming Usuario implements UserDetails

@Component
public class JwtUtils {

 @Value("${jwt.secret.key}") // You'll define this in application.properties
 private String secretKey;

 @Value("${jwt.time.expiration}") // You'll define this in application.properties
 private String timeExpiration;

 // Create JWT Token [cite: 1061]
 public String createToken(Authentication authentication) {
     Usuario usuario = (Usuario) authentication.getPrincipal(); // Get the authenticated user
     String username = usuario.getUsername();
     // String roles = usuario.getAuthorities().stream()
     // .map(GrantedAuthority::getAuthority)
     // .collect(Collectors.joining(",")); // Comma-separated roles

     Algorithm algorithm = Algorithm.HMAC256(this.secretKey); // [cite: 1060]
     return JWT.create()
             .withIssuer("api-bar") // [cite: 1062]
             .withSubject(username)
             // .withClaim("roles", roles) // Include roles in the token
             .withIssuedAt(new Date())
             .withExpiresAt(new Date(System.currentTimeMillis() + Long.parseLong(timeExpiration))) // [cite: 1063]
             .sign(algorithm);
 }

 // Validate JWT Token [cite: 1069]
 public DecodedJWT validateToken(String token) throws JWTVerificationException {
     Algorithm algorithm = Algorithm.HMAC256(this.secretKey);
     JWTVerifier verifier = JWT.require(algorithm)
             .withIssuer("api-bar")
             .build();
     return verifier.verify(token);
 }

 public String getUsernameFromToken(DecodedJWT decodedJWT) {
     return decodedJWT.getSubject();
 }
}
