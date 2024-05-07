package com.elasticsearch.search.service;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.elasticsearch.search.api.model.Result;
import com.elasticsearch.search.domain.EsClient;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final EsClient esClient;

    public SearchService(EsClient esClient) {
        this.esClient = esClient;
    }

    public List<Result> submitQuery(String query, String... filter) {
        co.elastic.clients.elasticsearch.core.SearchResponse searchResponse = null;

        if(filter == null || filter.length == 0) {
            searchResponse = esClient.search(query);
        } else {
            switch (filter[0]) {
                case "fuzziness":
                    searchResponse = esClient.searchWithFuzziness(query, filter);
                    break;
                case "dt_creation":
                    searchResponse = esClient.searchWithDtCreation(query, filter);
                    break;
                case "reading_time":
                    searchResponse = esClient.searchWithReadingTime(query, filter);
                    break;
                case "match_phrase":
                    searchResponse = esClient.searchWithMatchPhrase(query, filter);
                    break;
                case "and":
                    searchResponse = esClient.searchWithOperatorAnd(query, filter);
                    break;
                case "mustNot":
                    searchResponse = esClient.searchWithMustNot(query, filter);
                    break;
                default:
                    break;
            }
        }

        co.elastic.clients.elasticsearch.core.SearchResponse s =  searchResponse;
        List<Hit<ObjectNode>> hits = searchResponse.hits().hits();

        var resultsList = hits.stream().map(h ->
                new Result()
                        .abs(treatContent(h.source().get("content").asText()))
                        .title(h.source().get("title").asText())
                        .url(h.source().get("url").asText())
        ).collect(Collectors.toList());

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