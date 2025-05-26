package com.bar.services.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bar.persistence.entities.Usuario;
import com.bar.persistence.repositories.UsuarioRepository;

@Service
public class UserSecurityService implements UserDetailsService {

 @Autowired
 private UsuarioRepository usuarioRepository;

 @Override
 public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
     Usuario usuario = usuarioRepository.findByNombre(username)
             .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con nombre: " + username));
     return usuario;
 }
}