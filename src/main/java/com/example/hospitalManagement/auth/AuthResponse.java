package com.example.hospitalManagement.auth;


import com.example.hospitalManagement.user.Role;

public class AuthResponse {

    private String token;
    private String role;

    public AuthResponse(String token, Role role) {
        this.token = token;
        this.role = role.name();
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}