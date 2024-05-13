package com.elasticsearch.search.domain;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Highlight;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.fasterxml.jackson.databind.node.ObjectNode;
import nl.altindag.ssl.SSLFactory;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.client.RestClient;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
public class EsClient {
    private ElasticsearchClient elasticsearchClient;

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


    // execute query without filters
    public SearchResponse<ObjectNode> executeSearchQuery(Query finalMatchQuery) {
        try {
            return elasticsearchClient.search(s -> s
                    .index("wikipedia").from(0).size(10000)
                    .query(finalMatchQuery), ObjectNode.class
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // execute query with highlight
    public SearchResponse<ObjectNode> executeSearchQueryWithHighlight(Query finalMatchQuery) {
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


    // search without filters
    public SearchResponse searchWithoutFilters(String query) {
        String queryWithoutMarks = query.substring(1, query.length() - 1);
        if (queryWithoutMarks.startsWith("\"") && queryWithoutMarks.endsWith("\"")) {
            String phrase = queryWithoutMarks.substring(1, queryWithoutMarks.length() - 1);
            Query matchPhraseQuery = MatchPhraseQuery.of(q -> q.field("content").query(phrase))._toQuery();
            return executeSearchQueryWithHighlight(matchPhraseQuery);
        } else {
            Query matchQuery = MatchQuery.of(q -> q.field("content").query(query))._toQuery();
            return executeSearchQueryWithHighlight(matchQuery);
        }
    }

    //  search with operator 'and'
    public SearchResponse searchWithOperatorAnd(String query, String... filter) {
        Query matchQuery = MatchPhraseQuery.of(q -> q.field("content").query(query))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with boolQuery 'mustNot'
    public SearchResponse searchWithMustNot(String query, String... filter) {
        Query matchQuery = BoolQuery.of(q -> q.should(MatchQuery.of(l -> l.field("content").query(query))._toQuery()).mustNot(MatchQuery.of(l -> l.field("content").query(filter[1]))._toQuery()))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with dt_creation (range)
    public SearchResponse searchWithDtCreation(String query, String... filter) {
        Query matchQuery = BoolQuery.of(q -> q.should(MatchQuery.of(l -> l.field("content").query(query))._toQuery()).filter(RangeQuery.of(l -> l.field("dt_creation").lt(JsonData.of(filter[1])))._toQuery()))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with reading_time (range)
    public SearchResponse searchWithReadingTime(String query, String... filter) {
        Query matchQuery = BoolQuery.of(q -> q.should(MatchQuery.of(l -> l.field("content").query(query))._toQuery()).filter(RangeQuery.of(l -> l.field("reading_time").lt(JsonData.of(filter[1])))._toQuery()))._toQuery();
        return executeSearchQuery(matchQuery);
    }

    //  search with fuzziness
    public SearchResponse searchWithFuzziness(String query, String... filter) {
        Query matchQuery = MatchQuery.of(q -> q.field("content").query(query).fuzziness(filter[1]))._toQuery();
        return executeSearchQuery(matchQuery);
    }


}
