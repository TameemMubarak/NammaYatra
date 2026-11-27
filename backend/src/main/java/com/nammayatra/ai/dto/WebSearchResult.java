package com.nammayatra.ai.dto;

public record WebSearchResult(
        String title,
        String url,
        String content,
        double score
) {}
