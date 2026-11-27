package com.nammayatra.ai.dto;

import java.util.List;

public record ChatResponse(
        String reply,
        String model,
        List<WebSearchResult> sources
) {}
