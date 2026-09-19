package com.example.hospitalManagement.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register new user
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    // Login user
    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}
