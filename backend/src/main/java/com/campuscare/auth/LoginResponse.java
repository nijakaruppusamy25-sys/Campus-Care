package com.campuscare.auth;

public record LoginResponse(String token, Long userId, String name, String email, String role, String roomNumber, Integer floorNumber, boolean floorRep) {}
