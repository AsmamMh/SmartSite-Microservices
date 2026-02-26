package com.esprit.serviceprojet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ServiceProjetApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceProjetApplication.class, args);
    }
}
