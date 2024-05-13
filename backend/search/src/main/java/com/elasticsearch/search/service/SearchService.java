package com.elasticsearch.search.service;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.elasticsearch.search.api.model.Result;
import com.elasticsearch.search.domain.EsClient;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;

@Service
public class SearchService {

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

    public List<Result> submitQuery(String query, String... filter) {
        co.elastic.clients.elasticsearch.core.SearchResponse searchResponse = null;

        if(filter != null && filter.length > 0) {
            BiFunction<String, String[], co.elastic.clients.elasticsearch.core.SearchResponse> queryMethod = queryMethods.getOrDefault(filter[0], null);
            if (queryMethod != null) {
                searchResponse = queryMethod.apply(query, filter);
            }
        }

        if(searchResponse == null) {
            searchResponse = esClient.searchWithoutFilters(query);
        }

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
