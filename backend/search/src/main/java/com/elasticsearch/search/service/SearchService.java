package com.elasticsearch.search.service;
import co.elastic.clients.elasticsearch.core.search.*;
import com.elasticsearch.search.api.model.Result;
import com.elasticsearch.search.domain.EsClient;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchService.class);
    private final EsClient esClient;

    private final Map<String, BiFunction<String, String[], co.elastic.clients.elasticsearch.core.SearchResponse>> queryMethods;

    public SearchService(EsClient esClient) {
        this.esClient = esClient;

        queryMethods = new HashMap<>();
        queryMethods.put("fuzziness", esClient::searchWithFuzziness);
        queryMethods.put("dt_creation", esClient::searchWithDtCreation);
        queryMethods.put("reading_time", esClient::searchWithReadingTime);
        queryMethods.put("and", esClient::searchWithOperatorAnd);
        queryMethods.put("mustNot", esClient::searchWithMustNot);
    }

    public List<Result> submitQuery(String query, String... filters) {
        logger.info("Submitting query: query={}, filters={}", query, filters);
        co.elastic.clients.elasticsearch.core.SearchResponse searchResponse = null;

        if (filters != null && filters.length > 0) {
            String queryType = filters[0].replaceAll("\"", "");
            BiFunction<String, String[], co.elastic.clients.elasticsearch.core.SearchResponse> queryMethod = queryMethods.getOrDefault(queryType, null);

            if (queryMethod != null) {
                String[] filterParams = Arrays.stream(filters)
                        .skip(1)
                        .map(f -> f.replaceAll("\"", ""))
                        .toArray(String[]::new);
                logger.info("Executing query method for type: {}", queryType);
                searchResponse = queryMethod.apply(query, filterParams);
            }
        }

        if (searchResponse == null) {
            logger.info("No specific filters applied, executing default search");
            searchResponse = esClient.searchWithoutFilters(query);
        }

        List<Hit<ObjectNode>> hits = searchResponse.hits().hits();

        // Adicionar log para verificar os hits
        logger.info("Number of hits: {}", hits.size());

        var resultsList = hits.stream().map(h -> {
            String content = h.highlight().get("content") != null ? h.highlight().get("content").get(0) : "";
            String title = h.source().get("title") != null ? h.source().get("title").asText() : "";
            String url = h.source().get("url") != null ? h.source().get("url").asText() : "";

            return new Result()
                    .abs(treatContent(content))
                    .title(title)
                    .url(url);
        }).collect(Collectors.toList());

        return resultsList;
    }

    private String treatContent(String content) {
        content = content.replaceAll("</?(som|math)\\d*>", "");
        content = content.replaceAll("[^A-Za-z\\s]+", "");
        content = content.replaceAll("\\s+", " ");
        content = content.replaceAll("^\\s+", "");
        return content;
    }
}
