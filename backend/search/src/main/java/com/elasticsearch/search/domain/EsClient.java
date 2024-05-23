package com.elasticsearch.search.domain;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldSort;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.*;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.elasticsearch.search.service.SearchService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import nl.altindag.ssl.SSLFactory;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.client.RestClient;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import org.slf4j.LoggerFactory;


import java.io.IOException;

@Component
public class EsClient {
    private ElasticsearchClient elasticsearchClient;
    private static final Logger logger = LoggerFactory.getLogger(SearchService.class);

    public EsClient() {
        createConnection();
    }

    private void createConnection() {
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();

        String USER = "elastic";
        String PWD = "user123";
        credentialsProvider.setCredentials(AuthScope.ANY,
                new UsernamePasswordCredentials(USER, PWD));

        SSLFactory sslFactory = SSLFactory.builder()
                .withUnsafeTrustMaterial()
                .withUnsafeHostnameVerifier()
                .build();

        RestClient restClient = RestClient.builder(
                        new HttpHost("localhost", 9200, "https"))
                .setHttpClientConfigCallback((HttpAsyncClientBuilder httpClientBuilder) -> httpClientBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
                        .setSSLContext(sslFactory.getSslContext())
                        .setSSLHostnameVerifier(sslFactory.getHostnameVerifier())
                ).build();

        ElasticsearchTransport transport = new RestClientTransport(
                restClient,
                new JacksonJsonpMapper()
        );

        elasticsearchClient = new co.elastic.clients.elasticsearch.ElasticsearchClient(transport);
    }

    // execute query with highlight
    public SearchResponse<ObjectNode> executeSearchQuery(Query finalMatchQuery) {
        try {
            HighlightField highlightField = HighlightField.of(f -> f.highlightQuery(finalMatchQuery));
            Highlight highlight = Highlight.of(q -> q.fields("content", highlightField).numberOfFragments(1).fragmentSize(400).preTags("<strong>").postTags("</strong>"));

            return elasticsearchClient.search(s -> s
                    .index("wikipedia").from(0).size(10000)
                    .query(finalMatchQuery)
                    .highlight(highlight), ObjectNode.class
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

//    public SearchResponse<ObjectNode> processSuggestions(String text) {
//        try {
//            Suggester suggester = Suggester.of(s -> s.suggesters("my-suggestion", FieldSuggester.of(b -> b.text(text).term(TermSuggester.of(t -> t.size(2).field("content"))))));
//
//            return elasticsearchClient.search(s -> s
//                    .index("wikipedia").from(0).size(10000)
//                    .suggest(suggester), ObjectNode.class);
//
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }

    // execute query with sort field
    public SearchResponse<ObjectNode> executeSearchQueryWithSortField(Query finalMatchQuery, String fieldName, String sortOrder) {
        SortOrder order = sortOrder.equalsIgnoreCase("asc") ? SortOrder.Asc : SortOrder.Desc;
        try {
            return elasticsearchClient.search(s -> s
                    .index("wikipedia")
                    .from(0)
                    .size(10000)
                    .query(finalMatchQuery)
                    .sort(SortOptions.of(q -> q.field(FieldSort.of(n -> n.field(fieldName).order(order))))), ObjectNode.class
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    // search without filters
    public SearchResponse searchWithoutFilters(String query) {
        String queryWithoutMarks = query.substring(1, query.length() - 1);
        if (queryWithoutMarks.startsWith("\"") && queryWithoutMarks.endsWith("\"")) {
            String phrase = queryWithoutMarks.substring(1, queryWithoutMarks.length() - 1);
            Query matchPhraseQuery = MatchPhraseQuery.of(q -> q.field("content").query(phrase))._toQuery();
            return executeSearchQuery(matchPhraseQuery);
        } else {
            Query matchQuery = MatchQuery.of(q -> q.field("content").query(query))._toQuery();
            return executeSearchQuery(matchQuery);
        }
    }

    //  search with operator 'and'
    public SearchResponse searchWithOperatorAnd(String query, String... filter) {
        Query matchQuery = MatchPhraseQuery.of(q -> q.field("content").query(query))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with boolQuery 'mustNot'
    public SearchResponse searchWithMustNot(String query, String... filter) {
        Query matchQuery = BoolQuery.of(q -> q.should(MatchQuery.of(l -> l.field("content").query(query))._toQuery()).mustNot(MatchQuery.of(l -> l.field("content").query(filter[0]))._toQuery()))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with dt_creation (range)
    public SearchResponse<ObjectNode> searchWithDtCreation(String query, String... filters) {
        logger.info("Executing search with dt_creation filter: query={}, filters={}", query, filters);
        String comparison = filters[0];
        String date = filters[1];
        Query matchQuery;

        if (comparison.equals("lt")) {
            matchQuery = BoolQuery.of(q -> q
                    .should(MatchQuery.of(l -> l.field("content").query(query))._toQuery())
                    .filter(RangeQuery.of(l -> l.field("dt_creation").lt(JsonData.of(date)))._toQuery()))._toQuery();
        } else {
            matchQuery = BoolQuery.of(q -> q
                    .should(MatchQuery.of(l -> l.field("content").query(query))._toQuery())
                    .filter(RangeQuery.of(l -> l.field("dt_creation").gte(JsonData.of(date)))._toQuery()))._toQuery();
        }

        return executeSearchQuery(matchQuery);
    }

    //  search with reading_time (range)
    public SearchResponse<ObjectNode> searchWithReadingTime(String query, String... filters) {
        logger.info("Executing search with dt_creation filter: query={}, filters={}", query, filters);
        String comparison = filters[0];
        String date = filters[1];
        Query matchQuery;

        if (comparison.equals("lt")) {
            matchQuery = BoolQuery.of(q -> q
                    .should(MatchQuery.of(l -> l.field("content").query(query))._toQuery())
                    .filter(RangeQuery.of(l -> l.field("reading_time").lt(JsonData.of(date)))._toQuery()))._toQuery();
        } else {
            matchQuery = BoolQuery.of(q -> q
                    .should(MatchQuery.of(l -> l.field("content").query(query))._toQuery())
                    .filter(RangeQuery.of(l -> l.field("reading_time").gte(JsonData.of(date)))._toQuery()))._toQuery();
        }

        return executeSearchQuery(matchQuery);
    }

    //  search with fuzziness
    public SearchResponse searchWithFuzziness(String query, String... filter) {
        Query matchQuery = MatchQuery.of(q -> q.field("content").query(query).fuzziness(filter[0]))._toQuery();
        return executeSearchQuery(matchQuery);
    }
}
