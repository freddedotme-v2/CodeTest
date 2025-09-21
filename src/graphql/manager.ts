import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

export default class GraphQLManager {
    API_KEY: string = ""
    client: ApolloClient

    constructor() {
        const authLink = new SetContextLink(({ headers }) => {
            return {
                headers: {
                    ...headers,
                    'x-api-key': this.API_KEY
                }
            }
        })

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