import {
  ApolloClient,
  ApolloLink,
  concat,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client';
import fetch from 'cross-fetch';
import cookies from 'js-cookie';
import { useMemo } from 'react';
import { LaunchConnection } from '@space-explorer/graphql/react';

const getToken = () => {
  if (!process.browser) {
    return null;
  }
  return `Bearer ${cookies.get('token')}`;
};

const mergePagination: FieldMergeFunction<LaunchConnection> = (
  existing,
  incoming
) => {
  return {
    ...incoming,
    launches: existing
      ? [...existing.launches, ...incoming.launches]
      : incoming.launches,
  };
};

const cacheOptions: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        launches: {
          keyArgs: [],
          merge: mergePagination,
        },
      },
    },
  },
};

const httpLink = new HttpLink({
  uri: 'http://localhost:3333/graphql',
  fetch: fetch,
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: getToken(),
    },
  });
  return forward(operation);
});

let globalApollo = null;

export const createClient = (
  initialState?: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> => {
  if (!globalApollo) {
    globalApollo = new ApolloClient({
      link: concat(authLink, httpLink),
      ssrMode: !process.browser,
      cache: new InMemoryCache(cacheOptions).restore(initialState || {}),
    });
  }
  return globalApollo;
};

export const useApolloStore = (initialState?: NormalizedCacheObject) => {
  const store = useMemo(() => createClient(initialState), [initialState]);
  return store;
};
