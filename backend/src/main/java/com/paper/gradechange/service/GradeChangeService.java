package com.paper.gradechange.service;

import com.paper.gradechange.dto.GradeChangeRequestDTO;
import com.paper.gradechange.dto.GradeChangeResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GradeChangeService {

    private final RestTemplate restTemplate;

    @Value("${ai.fastapi.url:http://localhost:8000/predict}")
    private String fastApiUrl;

    public GradeChangeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public GradeChangeResponseDTO getPrediction(GradeChangeRequestDTO requestDTO) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<GradeChangeRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        ResponseEntity<GradeChangeResponseDTO> response = restTemplate.postForEntity(
                fastApiUrl,
                entity,
                GradeChangeResponseDTO.class
        );

        return response.getBody();
    }
}
