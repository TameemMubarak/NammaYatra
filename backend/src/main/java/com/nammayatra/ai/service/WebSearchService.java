package com.nammayatra.ai.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import tools.jackson.databind.JsonNode;

import com.nammayatra.ai.dto.WebSearchResult;

@Service
public class WebSearchService {

    private static final int MAX_RESULTS = 5;

    private static final double MIN_RELEVANCE_SCORE = 0.30;

    private static final Set<String> BLOCKED_DOMAINS = Set.of(
            "facebook.com",
            "instagram.com",
            "twitter.com",
            "x.com",
            "youtube.com",
            "youtu.be",
            "tiktok.com",
            "pinterest.com",
            "linkedin.com",
            "reddit.com"
    );

    private final RestClient restClient;
    private final String apiKey;

    public WebSearchService(
            RestClient.Builder builder,
            @Value("${TAVILY_API_KEY:}") String apiKey) {

        this.apiKey = apiKey;

        this.restClient = builder
                .baseUrl("https://api.tavily.com")
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        "application/json"
                )
                .build();
    }

    public List<WebSearchResult> search(String query) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Tavily API key is not configured."
            );
        }

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(
                    "Search query cannot be empty."
            );
        }

        Map<String, Object> requestBody = Map.of(
                "query", query,
                "topic", "general",
                "search_depth", "basic",
                "max_results", 10,
                "include_answer", false,
                "include_raw_content", false
        );

        try {

            JsonNode response = restClient.post()
                    .uri("/search")
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + apiKey
                    )
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null || !response.has("results")) {
                throw new IllegalStateException(
                        "Tavily returned an invalid response."
                );
            }

            JsonNode resultsNode = response.path("results");

            List<WebSearchResult> results = new ArrayList<>();

            for (JsonNode result : resultsNode) {

                String title = result.path("title").asText("");
                String url = result.path("url").asText("");
                String content = result.path("content").asText("");
                double score = result.path("score").asDouble(0.0);

                if (title.isBlank() || content.isBlank()) {
                    continue;
                }

                if (score < MIN_RELEVANCE_SCORE) {
                    continue;
                }

                if (!isValidUrl(url)) {
                    continue;
                }

                if (isBlockedDomain(url)) {
                    continue;
                }

                results.add(
                        new WebSearchResult(
                                title,
                                url,
                                content,
                                score
                        )
                );
            }

            return filterAndRank(results);

        } catch (RestClientResponseException exception) {

            int status = exception.getStatusCode().value();

            if (status == 401 || status == 403) {
                throw new IllegalStateException(
                        "Tavily authentication failed. Check the configured API key."
                );
            }

            if (status == 429) {
                throw new IllegalStateException(
                        "Tavily rate limit reached. Please try again later."
                );
            }

            throw new IllegalStateException(
                    "Tavily search failed with HTTP status: " + status
            );

        } catch (RestClientException exception) {

            throw new IllegalStateException(
                    "Unable to connect to the Tavily search service."
            );
        }
    }

    private boolean isValidUrl(String url) {

        try {

            URI uri = URI.create(url.trim());

            String scheme = uri.getScheme();

            return uri.getHost() != null
                    && ("http".equalsIgnoreCase(scheme)
                    || "https".equalsIgnoreCase(scheme));

        } catch (IllegalArgumentException exception) {

            return false;
        }
    }

    private boolean isBlockedDomain(String url) {

        try {

            URI uri = URI.create(url.trim());

            String host = uri.getHost()
                    .toLowerCase(Locale.ROOT);

            if (host.startsWith("www.")) {
                host = host.substring(4);
            }

            for (String domain : BLOCKED_DOMAINS) {

                if (host.equals(domain)
                        || host.endsWith("." + domain)) {
                    return true;
                }
            }

            return false;

        } catch (IllegalArgumentException exception) {

            return true;
        }
    }

    private List<WebSearchResult> filterAndRank(
            List<WebSearchResult> results) {

        List<WebSearchResult> sortedResults = results.stream()
                .sorted(
                        Comparator.comparingDouble(
                                WebSearchResult::score
                        ).reversed()
                )
                .toList();

        Set<String> seenUrls = new HashSet<>();

        List<WebSearchResult> filteredResults = new ArrayList<>();

        for (WebSearchResult result : sortedResults) {

            String normalizedUrl = normalizeUrl(result.url());

            if (!seenUrls.add(normalizedUrl)) {
                continue;
            }

            filteredResults.add(result);

            if (filteredResults.size() >= MAX_RESULTS) {
                break;
            }
        }

        return filteredResults;
    }

    private String normalizeUrl(String url) {

        URI uri = URI.create(url.trim());

        String host = uri.getHost()
                .toLowerCase(Locale.ROOT);

        if (host.startsWith("www.")) {
            host = host.substring(4);
        }

        String path = uri.getRawPath();

        if (path == null || path.isBlank()) {
            path = "/";
        }

        while (path.length() > 1 && path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        return host + path;
    }
}
