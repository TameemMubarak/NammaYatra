package com.nammayatra.ai.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 4000, message = "Message cannot exceed 4000 characters")
    String message,

    @Size(max = 20, message = "Maximum 20 previous messages allowed")
    List<@Valid ChatMessage> history

) {}
