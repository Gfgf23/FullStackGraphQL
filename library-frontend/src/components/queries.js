import {gql} from '@apollo/client'

export const ALL_AUTHORS = gql`
query{
	allAuthors{
		name
		born
		bookCount
	}
}
`

export const ALL_BOOKS = gql`
query{
	allBooks{
		title
		author{
			name
		}
		published
		genres
	}
}
`

export const ADD_BOOK = gql`
mutation addNewBook($title: String!,$published: Int!,$author: String!,$genres: [String!]!){
	addBook(
	title:$title,
	published:$published,
	author:$author,
	genres:$genres
	){
		title
		
	}
}
`

export const UPDATE_AUTHOR = gql`
mutation updateAuthor($name: String!,$born: Int!){
	editAuthor(
	name:$name,
	setBornTo:$born
	)
	{
		name
		born
	}
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ALL_BOOKS_GENRE = gql`
query Query($genre: String!) {
  allBooks(genre:$genre) {
    title
		author{
			name
		}
	published
	genres
  }
}
`

export const FAVORITE_GENRE_BOOKS =gql`
query {
	favoriteGenreBooks{
		title
		author{
			name
		}
		published
		genres
	}
	
}
`

export const ME = gql`
query Query {
  me {
    username
    favoriteGenre
  }
}
`