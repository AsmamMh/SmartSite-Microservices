package com.esprit.smartsite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SmartsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartsiteApplication.class, args);
    }

}
