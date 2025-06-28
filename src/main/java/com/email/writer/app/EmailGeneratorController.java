package com.email;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/email")
public class EmailGeneratorController {

    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        // Logic to generate email content
        String emailContent = "This is a sample email content.";

        // Return the generated email content as a response
        return ResponseEntity.ok(emailContent);
    }
}
