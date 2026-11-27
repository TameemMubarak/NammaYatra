package com.nammayatra.ai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.nammayatra.ai.dto.ChatRequest;
import com.nammayatra.ai.dto.ChatMessage;
import com.nammayatra.ai.dto.ChatResponse;
import com.nammayatra.ai.dto.WebSearchResult;
import com.nammayatra.ai.service.AIChatService;
import com.nammayatra.ai.service.WebSearchService;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIChatService aiChatService;
    private final WebSearchService webSearchService;

    public AIChatController(
            AIChatService aiChatService,
            WebSearchService webSearchService) {

        this.aiChatService = aiChatService;
        this.webSearchService = webSearchService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request) {

        List<ChatMessage> history = request.history();

        ChatResponse response = aiChatService.chat(
                request.message(),
                history
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<WebSearchResult>> search(
            @RequestParam String query) {

        List<WebSearchResult> results =
                webSearchService.search(query);

        return ResponseEntity.ok(results);
    }
}
