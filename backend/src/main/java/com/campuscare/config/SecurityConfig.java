    @Bean CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "https://frontend-six-topaz-8uodqrcc6m.vercel.app"
        )); 
        c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("*")); 
        c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource(); 
        s.registerCorsConfiguration("/**", c); 
        return s;
    }
