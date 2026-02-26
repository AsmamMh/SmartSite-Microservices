package com.esprit.serviceuser.repository;

import com.esprit.serviceuser.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByActifTrue();
    
    List<User> findByRole(com.esprit.serviceuser.entity.Role role);
    
    List<User> findByNomContainingIgnoreCase(String nom);
}
