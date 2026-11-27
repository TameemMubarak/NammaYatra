package com.nammayatra.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChatMessage(

    @NotBlank
    @Pattern(regexp = "user|assistant",
             message = "Role must be user or assistant")
    String role,

    @NotBlank
    @Size(max = 4000)
    String content

) {}
