package com.nammayatra.ai.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nammayatra.ai.dto.ChatMessage;
import com.nammayatra.ai.dto.ChatResponse;
import com.nammayatra.ai.dto.WebSearchResult;

@Service
public class AIChatService {

    private static final Logger logger =
            LoggerFactory.getLogger(AIChatService.class);

    private final GroqService groqService;
    private final WebSearchService webSearchService;

    public AIChatService(
            GroqService groqService,
            WebSearchService webSearchService) {

        this.groqService = groqService;
        this.webSearchService = webSearchService;
    }

    public ChatResponse chat(
            String message,
            List<ChatMessage> history) {

        List<WebSearchResult> sources = new ArrayList<>();

        String searchContext = "";

        if (needsWebSearch(message)
        || isTravelFollowUp(message, history)) {

            String searchQuery = buildSearchQuery(message, history);

            try {
                sources = webSearchService.search(searchQuery);

                searchContext = buildSearchContext(sources);

            } catch (Exception exception) {

                logger.warn(
                        "Travel web search unavailable: {}",
                        exception.getMessage()
                );

                searchContext = """
                        External web search was unavailable for this request.
                        Do not claim that you searched the web.
                        Clearly distinguish general suggestions from verified facts.
                        """;
            }
        }

        String reply = groqService.generateReply(
                message,
                history,
                searchContext
        );

        return new ChatResponse(
                reply,
                "NammaYatra AI",
                sources
        );
    }

    private boolean needsWebSearch(String message) {

    if (message == null || message.isBlank()) {
        return false;
    }

    String text = message.toLowerCase(Locale.ROOT);

    String[] travelKeywords = {
            "destination",
            "destinations",
            "places to visit",
            "places near",
            "tourist places",
            "weekend trip",
            "weekend getaway",
            "travel itinerary",
            "plan a trip",
            "plan my trip",
            "trip plan",
            "things to do",
            "attractions",
            "waterfall",
            "waterfalls",
            "hill station",
            "trek",
            "trekking",
            "camping",
            "nature",
            "sightseeing",
            "travel options",
            "route",
            "accommodation",
            "where to stay",
            "opening hours",
            "entry fee",
            "ticket price",
            "travel from",
            "travel to",
            "trip to",
            "trip from",
            "visit",
            "explore",
            "travel",
            "travelling",
            "traveling",
            "trip duration",
            "trip cost",
            "trip budget",
            "travel budget",
            "travel cost",
            "cost of travelling",
            "cost of traveling",
            "cost to visit",
            "distance from",
            "distance to",
            "how far is",
            "how to reach",
            "how do i reach",
            "bus from",
            "train from",
            "flight from"
    };

    for (String keyword : travelKeywords) {
        if (text.contains(keyword)) {
            return true;
        }
    }

    // Search for budget-related questions only when travel is explicit.
    boolean asksTravelBudget =
            text.contains("budget")
                    && (text.contains("trip")
                    || text.contains("travel")
                    || text.contains("destination")
                    || text.contains("visit")
                    || text.contains("holiday")
                    || text.contains("vacation"));

    return asksTravelBudget;
}

    private String buildSearchQuery(
        String message,
        List<ChatMessage> history) {

    StringBuilder query = new StringBuilder();

    // Include recent conversation context only for follow-up questions.
    if (isTravelFollowUp(message, history)
            && history != null) {

        int start = Math.max(0, history.size() - 4);

        for (int i = start; i < history.size(); i++) {

            ChatMessage previous = history.get(i);

            if (previous != null
                    && previous.content() != null
                    && ("user".equals(previous.role())
                    || "assistant".equals(previous.role()))) {

                String content = previous.content().trim();

                // Keep each previous message short.
                if (content.length() > 160) {
                    content = content.substring(0, 160);
                }

                query.append(content).append(" ");
            }
        }
    }

    // Always include the current question.
    query.append(message.trim());

    String finalQuery = query.toString().trim();

    // Prevent excessively long search queries.
    if (finalQuery.length() > 500) {
        finalQuery = finalQuery.substring(0, 500);
    }

    return finalQuery;
}

private boolean isTravelFollowUp(
        String message,
        List<ChatMessage> history) {

    if (message == null || message.isBlank()
            || history == null || history.isEmpty()) {
        return false;
    }

    String text = message.toLowerCase(Locale.ROOT).trim();

    // Follow-up questions that depend on previous context.
    String[] followUpKeywords = {
            "what about",
            "how about",
            "which one",
            "which is best",
            "tell me more",
            "more details",
            "more information",
            "how much",
            "how far",
            "how long",
            "what is the cost",
            "is it safe",
            "there",
            "that place",
            "that one",
            "those places",
            "this place",
            "its distance",
            "its cost"
    };

    boolean followUp = false;

    for (String keyword : followUpKeywords) {
        if (text.contains(keyword)) {
            followUp = true;
            break;
        }
    }

    if (!followUp) {
        return false;
    }

    // Confirm that the recent conversation is about travel.
    int start = Math.max(0, history.size() - 6);

    for (int i = start; i < history.size(); i++) {

        ChatMessage previous = history.get(i);

        if (previous == null || previous.content() == null) {
            continue;
        }

        String previousText =
                previous.content().toLowerCase(Locale.ROOT);

        String[] travelKeywords = {
                "travel",
                "trip",
                "destination",
                "weekend",
                "itinerary",
                "tourist",
                "places to visit",
                "sightseeing",
                "budget",
                "route",
                "distance",
                "waterfall",
                "trek",
                "nature",
                "bengaluru",
                "bangalore"
        };

        for (String keyword : travelKeywords) {
            if (previousText.contains(keyword)) {
                return true;
            }
        }
    }

    return false;
}


    private String buildSearchContext(
            List<WebSearchResult> sources) {

        if (sources == null || sources.isEmpty()) {
            return "No relevant external search results were found.";
        }

        StringBuilder context = new StringBuilder();

        context.append("""
                The following information was retrieved from external web search.
                Treat it as reference material, not as guaranteed truth.

                """);

        for (int i = 0; i < sources.size(); i++) {

            WebSearchResult source = sources.get(i);

            context.append("REFERENCE MATERIAL\n");

            context.append("Title: ")
                    .append(source.title())
                    .append("\n");

            context.append("URL: ")
                    .append(source.url())
                    .append("\n");

            context.append("Content: ")
                    .append(source.content())
                    .append("\n\n");
        }

        return context.toString();
    }

}
