package com.example.hospitalManagement.auth;


import com.example.hospitalManagement.security.JwtService;
import com.example.hospitalManagement.user.User;
import com.example.hospitalManagement.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register a new user
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                null,
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, savedUser.getRole());
    }

    // Login an existing user
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getRole());
    }
}
