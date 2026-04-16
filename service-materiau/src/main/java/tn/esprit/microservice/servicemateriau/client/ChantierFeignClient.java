package tn.esprit.microservice.servicemateriau.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;

import java.util.List;

@FeignClient(name = "service-gestion-chantier")
public interface ChantierFeignClient {

    @GetMapping("/api/chantiers")
    List<ChantierResponse> getAllChantiers();
}