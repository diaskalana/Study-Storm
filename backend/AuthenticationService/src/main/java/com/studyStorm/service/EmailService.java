package com.studyStorm.service;
import com.studyStorm.dto.MailBody;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    private final RestTemplate restTemplate;

    // Define the URL of your Node.js service directly in the code
    private static final String NODE_EMAIL_SERVICE_URL = "http://notification-service:4000/send-email";

    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendSimpleMessage(MailBody mailBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create request body with mail details
        HttpEntity<MailBody> request = new HttpEntity<>(mailBody, headers);

        // Make POST request to Node.js service endpoint
        ResponseEntity<Void> responseEntity = restTemplate.postForEntity(NODE_EMAIL_SERVICE_URL, request, Void.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            System.out.println("Mail sent successfully");
        } else {
            System.out.println("Failed to send mail. Status code: " + responseEntity.getStatusCodeValue());
        }
    }
}
