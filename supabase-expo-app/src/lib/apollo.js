import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://iclyrxgazxranogicjoa.supabase.co/graphql/v1',
  headers: {
    apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbHlyeGdhenhyYW5vZ2ljam9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzE1OTksImV4cCI6MjA2NzQwNzU5OX0.K1tTkBd5Hcjw-snBlEibAmz2pDLbmULQoPV8O3lJVUE',
    'Content-Type': 'application/json',
  }
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});