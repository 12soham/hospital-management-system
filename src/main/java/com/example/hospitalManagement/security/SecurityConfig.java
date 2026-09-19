package com.example.hospitalManagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =========================
                // CSRF
                // =========================
                .csrf(csrf -> csrf.disable())


                // =========================
                // SESSION MANAGEMENT
                // =========================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =========================
                // AUTHORIZATION
                // =========================
                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // AUTHENTICATION API
                        // =========================

                        // LOGIN — public
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        )
                        .permitAll()

                        // REGISTER — ADMIN ONLY
                        // (previously permitAll(), which let anyone
                        // self-register as ADMIN with zero
                        // authentication — this closes that hole.
                        // New staff accounts are now created by an
                        // already-logged-in Admin.)
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register"
                        )
                        .hasRole("ADMIN")


                        // =========================
                        // DASHBOARD API
                        // =========================
                        // VIEW DASHBOARD STATS
                        // ADMIN + DOCTOR + RECEPTIONIST
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )


                        // =========================
                        // FRONTEND PAGES
                        // =========================
                        .requestMatchers(
                                "/login",

                                "/dashboard",

                                "/patients",
                                "/patients/add",
                                "/patients/edit/**",

                                "/doctors",
                                "/doctors/add",
                                "/doctors/edit/**",

                                "/appointments",
                                "/appointments/**",

                                "/prescriptions",
                                "/prescriptions/**",

                                "/billing",
                                "/billing/**",

                                "/staff"
                        )
                        .permitAll()


                        // =========================
                        // STATIC RESOURCES
                        // =========================
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/favicon.ico"
                        )
                        .permitAll()


                        // =========================
                        // DOCTOR APIs
                        // =========================

                        // VIEW DOCTORS
                        // ADMIN + DOCTOR + RECEPTIONIST
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )

                        // ADD DOCTOR
                        // ADMIN ONLY
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // EDIT DOCTOR
                        // ADMIN ONLY
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE DOCTOR
                        // ADMIN ONLY
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")


                        // =========================
                        // PATIENT APIs
                        // =========================

                        // ADMIN + DOCTOR + RECEPTIONIST
                        .requestMatchers(
                                "/api/patients/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )


                        // =========================
                        // APPOINTMENT APIs
                        // =========================

                        // VIEW
                        // ADMIN + DOCTOR + RECEPTIONIST
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )

                        // ADD
                        // ADMIN + DOCTOR + RECEPTIONIST
                        // (Doctors can now book appointments too,
                        // matching the visible "Book Appointment"
                        // button on their Appointments page)
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )

                        // COMPLETE
                        // ADMIN + DOCTOR
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/appointments/*/complete"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR"
                        )

                        // CANCEL
                        // ADMIN + DOCTOR
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/appointments/*/cancel"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR"
                        )

                        // EDIT
                        // ADMIN + DOCTOR + RECEPTIONIST
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/appointments/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )

                        // DELETE
                        // ADMIN ONLY
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/appointments/**"
                        )
                        .hasRole("ADMIN")


                        // =========================
                        // PRESCRIPTION APIs
                        // =========================

                        // VIEW
                        // ADMIN + DOCTOR + RECEPTIONIST
                        // (Receptionists can view/print prescriptions
                        // — e.g. for handing a copy to a patient —
                        // but cannot create, edit, or delete them)
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/prescriptions/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )

                        // ADD / EDIT / DELETE
                        // ADMIN + DOCTOR ONLY
                        .requestMatchers(
                                "/api/prescriptions/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR"
                        )


                        // =========================
                        // BILLING APIs
                        // =========================

                        // ---------------------------------
                        // VIEW BILLS
                        // ADMIN + DOCTOR + RECEPTIONIST
                        // ---------------------------------
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/bills/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )


                        // ---------------------------------
                        // GENERATE BILL
                        // ADMIN + RECEPTIONIST
                        // ---------------------------------
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/bills/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "RECEPTIONIST"
                        )


                        // ---------------------------------
                        // MARK BILL AS PAID
                        // ADMIN + DOCTOR + RECEPTIONIST
                        // (Receptionists handle front-desk payment
                        // collection, so they need this too)
                        // ---------------------------------
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/bills/*/pay"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR",
                                "RECEPTIONIST"
                        )


                        // ---------------------------------
                        // DELETE BILL
                        // ADMIN ONLY
                        // ---------------------------------
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/bills/**"
                        )
                        .hasRole("ADMIN")


                        // =========================
                        // EVERYTHING ELSE
                        // =========================
                        .anyRequest()
                        .authenticated()
                )


                // =========================
                // JWT FILTER
                // =========================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}