import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloClient,ApolloProvider, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((request, { headers }) => {
  console.log(request)
  const token = localStorage.getItem('library-user-token')
  console.log(token)
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink)
})


ReactDOM.render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>,
 document.getElementById('root')
 )