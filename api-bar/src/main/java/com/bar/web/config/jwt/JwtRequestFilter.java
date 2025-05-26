package com.bar.web.config.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter; // [cite: 1071]

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bar.services.security.UserSecurityService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter { // [cite: 1071]

 @Autowired
 private JwtUtils jwtUtils; // [cite: 1071]

 @Autowired
 private UserSecurityService userSecurityService; // [cite: 1071]

 @Override
 protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException { // [cite: 1072]

     final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION); // [cite: 1073]

     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
         filterChain.doFilter(request, response);
         return;
     }

     String jwt = authHeader.substring(7); // "Bearer ".length()
     DecodedJWT decodedJWT;

     try {
         decodedJWT = jwtUtils.validateToken(jwt); // [cite: 1073]
     } catch (JWTVerificationException e) {
         filterChain.doFilter(request, response);
         return;
     }

     String username = jwtUtils.getUsernameFromToken(decodedJWT); // [cite: 1074]

     if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
         UserDetails userDetails = this.userSecurityService.loadUserByUsername(username);

         // If token is valid, configure Spring Security to manually set authentication
          if (decodedJWT != null) { // Basic check, could add more specific validation if needed
             UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                     userDetails, null, userDetails.getAuthorities());
             // No need to set details from request as it's stateless
             SecurityContextHolder.getContext().setAuthentication(authToken); // [cite: 1074]
         }
     }
     filterChain.doFilter(request, response);
 }
}
