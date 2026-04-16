package com.esprit.serviceuser.service;

import com.esprit.serviceuser.dto.UserDto;
import com.esprit.serviceuser.dto.UserUpsertRequest;
import com.esprit.serviceuser.entity.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Value("${keycloak.server-url:http://localhost:8080}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm:smartsite}")
    private String keycloakRealm;

    @Value("${keycloak.admin.realm:master}")
    private String keycloakAdminRealm;

    @Value("${keycloak.admin.client-id:admin-cli}")
    private String keycloakAdminClientId;

    @Value("${keycloak.admin.username:admin}")
    private String keycloakAdminUsername;

    @Value("${keycloak.admin.password:admin}")
    private String keycloakAdminPassword;

    private final RestTemplate restTemplate = new RestTemplate();

    public UserDto createUser(UserUpsertRequest user) {
        Map<String, Object> payload = toKeycloakPayload(user);

        ResponseEntity<Void> response = restTemplate.exchange(
                usersEndpoint(),
                HttpMethod.POST,
                new HttpEntity<>(payload, authJsonHeaders()),
                Void.class
        );

        URI location = response.getHeaders().getLocation();
        if (location == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to resolve created Keycloak user");
        }

        String[] segments = location.getPath().split("/");
        String userId = segments[segments.length - 1];

        return getUserById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Created Keycloak user not found"));
    }

    public List<UserDto> getAllUsers() {
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                usersEndpoint() + "?max=500",
                HttpMethod.GET,
                new HttpEntity<>(authHeaders()),
                new ParameterizedTypeReference<>() {
                }
        );

        List<Map<String, Object>> body = response.getBody();
        if (body == null) {
            return List.of();
        }

        return body.stream().map(this::fromKeycloakUser).collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(String id) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    usersEndpoint() + "/" + id,
                    HttpMethod.GET,
                    new HttpEntity<>(authHeaders()),
                    new ParameterizedTypeReference<>() {
                    }
            );

            Map<String, Object> body = response.getBody();
            if (body == null) {
                return Optional.empty();
            }

            return Optional.of(fromKeycloakUser(body));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    public Optional<UserDto> getUserByEmail(String email) {
        return getAllUsers().stream()
                .filter(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public List<UserDto> getActiveUsers() {
        return getAllUsers().stream().filter(UserDto::isActif).collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(Role role) {
        return getAllUsers().stream()
                .filter(u -> u.getRole() == role)
                .collect(Collectors.toList());
    }

    public UserDto updateUser(String id, UserUpsertRequest userDetails) {
        Map<String, Object> payload = toKeycloakPayload(userDetails);

        restTemplate.exchange(
                usersEndpoint() + "/" + id,
                HttpMethod.PUT,
                new HttpEntity<>(payload, authJsonHeaders()),
                Void.class
        );

        return getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public void deleteUser(String id) {
        restTemplate.exchange(
                usersEndpoint() + "/" + id,
                HttpMethod.DELETE,
                new HttpEntity<>(authHeaders()),
                Void.class
        );
    }

    public long countUsers() {
        return getAllUsers().size();
    }

    private String usersEndpoint() {
        return keycloakServerUrl + "/admin/realms/" + keycloakRealm + "/users";
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(fetchAdminAccessToken());
        return headers;
    }

    private HttpHeaders authJsonHeaders() {
        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private String fetchAdminAccessToken() {
        String tokenUrl = keycloakServerUrl + "/realms/" + keycloakAdminRealm + "/protocol/openid-connect/token";

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", keycloakAdminClientId);
        form.add("username", keycloakAdminUsername);
        form.add("password", keycloakAdminPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                new HttpEntity<>(form, headers),
                new ParameterizedTypeReference<>() {
                }
        );

        Map<String, Object> body = response.getBody();
        if (body == null || body.get("access_token") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unable to authenticate to Keycloak admin API");
        }

        return body.get("access_token").toString();
    }

    private Map<String, Object> toKeycloakPayload(UserUpsertRequest user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("enabled", user.isActif());
        payload.put("firstName", user.getPrenom());
        payload.put("lastName", user.getNom());
        payload.put("email", user.getEmail());
        payload.put("username", user.getEmail());
        payload.put("emailVerified", true);

        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("telephone", singleValue(user.getTelephone()));
        attributes.put("poste", singleValue(user.getPoste()));
        attributes.put("role", singleValue(user.getRole() == null ? null : user.getRole().name()));
        payload.put("attributes", attributes);

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            Map<String, Object> credential = new HashMap<>();
            credential.put("type", "password");
            credential.put("temporary", false);
            credential.put("value", user.getPassword());

            List<Map<String, Object>> credentials = new ArrayList<>();
            credentials.add(credential);
            payload.put("credentials", credentials);
        }

        return payload;
    }

    private List<String> singleValue(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return List.of(value);
    }

    @SuppressWarnings("unchecked")
    private UserDto fromKeycloakUser(Map<String, Object> keycloakUser) {
        UserDto user = new UserDto();
        user.setId((String) keycloakUser.get("id"));
        user.setPrenom((String) keycloakUser.getOrDefault("firstName", ""));
        user.setNom((String) keycloakUser.getOrDefault("lastName", ""));
        user.setEmail((String) keycloakUser.get("email"));

        Boolean enabled = (Boolean) keycloakUser.get("enabled");
        user.setActif(enabled == null || enabled);

        Object attributesRaw = keycloakUser.get("attributes");
        if (attributesRaw instanceof Map<?, ?> attrs) {
            String telephone = getAttributeValue((Map<String, Object>) attrs, "telephone");
            String poste = getAttributeValue((Map<String, Object>) attrs, "poste");
            String roleName = getAttributeValue((Map<String, Object>) attrs, "role");

            user.setTelephone(telephone);
            user.setPoste(poste);
            if (roleName != null && !roleName.isBlank()) {
                try {
                    user.setRole(Role.valueOf(roleName.toUpperCase(Locale.ROOT)));
                } catch (IllegalArgumentException ignored) {
                    user.setRole(null);
                }
            }
        }

        return user;
    }

    @SuppressWarnings("unchecked")
    private String getAttributeValue(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        if (value instanceof List<?> list && !list.isEmpty()) {
            Object first = list.get(0);
            return first == null ? null : first.toString();
        }
        return value == null ? null : value.toString();
    }
}
