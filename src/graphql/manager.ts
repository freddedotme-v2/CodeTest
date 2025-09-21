import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

export default class GraphQLManager {
    API_KEY: string = ""
    client: ApolloClient

    constructor() {
        // Creating a context link that will update the client with the correct
        // API_KEY for each request.
        const authLink = new SetContextLink(({ headers }) => {
            return {
                headers: {
                    ...headers,
                    'x-api-key': this.API_KEY
                }
            }
        })

        // Initially the cache mode was 'cache-first' but since the GQL API only
        // authorize on network requests it would only do so the first time and
        // then it uses the cache to return data on future requests, while 
        // ignoring to check if the API_KEY is correct.
        // I wanted to somehow verify just the API_KEY and then use the cache as
        // much as possible to speed up queries, but I don't know the best
        // approach to do so.
        this.client = new ApolloClient({
            link: authLink.concat(new HttpLink({ uri: process.env.GQL_ENDPOINT! })),
            cache: new InMemoryCache(),
            defaultOptions: { query: { fetchPolicy: 'network-only' }}
        })
    }

    query(query: string, variables = {}) : Promise<{ success: boolean; body: any; }> {
        const response = this.client.query({ 
            query: gql(query),
            variables: variables
        }).then((result) => {
            return { success: true, body: result }
        }).catch((error) => {
            return { success: false, body: error }
        })

        return response
    }
}