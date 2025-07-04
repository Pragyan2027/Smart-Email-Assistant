
package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class GenerateReplyController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generateReply")
    public Mono<ResponseEntity<String>> generateReply(@RequestBody EmailRequest emailRequest) {
        return emailGeneratorService.generateEmailReply(emailRequest)
                .map(ResponseEntity::ok);
    }
}
