package com.esprit.servicegestiondeschantier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ServicegestiondeschantierApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServicegestiondeschantierApplication.class, args);
    }

}
