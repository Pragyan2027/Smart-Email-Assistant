package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public Mono<ResponseEntity<String>> generateEmail(@RequestBody EmailRequest emailRequest) {
        return emailGeneratorService.generateEmailReply(emailRequest)
                .map(ResponseEntity::ok);
    }

    // New endpoint for /api/generateReply
    @PostMapping("/../generateReply")
    public Mono<ResponseEntity<String>> generateReply(@RequestBody EmailRequest emailRequest) {
        return emailGeneratorService.generateEmailReply(emailRequest)
                .map(ResponseEntity::ok);
    }
}
