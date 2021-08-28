const { ApolloServer, gql,UserInputError,AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./Author')
const Book = require('./Book')
const User = require('./User')
const jwt = require('jsonwebtoken')


const JWT_SECRET = 'SECRET'
const PASSWORD = 'secret'

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0.xntns.mongodb.net/graphqlDatabase?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })






const typeDefs = gql`
  type Author {
	  name: String!
	  id: ID!
	  born: Int
	  bookCount: Int!
  }
  type Book {
	  title: String!
	  published: Int!
	  author: Author!
	  id: ID!
	  genres:[String!]! 
  }
  type User {
	  username: String!
      favoriteGenre: String!
      id: ID!
  }
  type Token {
	  value: String!
}
  type Query {
	  bookCount: Int!
	  allBooks(author: String genre:String): [Book!]!
	  favoriteGenreBooks: [Book!]!
	  authorCount: Int!
	  allAuthors: [Author!]!
	  me: User
  }
  type Mutation {
	  addBook(
	  title: String!
	  author: String!
	  published: Int! 
	  genres: [String!]!
	  ): Book
	  editAuthor(
	  name: String!
	  setBornTo: Int!
	  ): Author
	  createUser(
      username: String!
      favoriteGenre: String!
      ): User
      login(
      username: String!
      password: String!
      ): Token
  }
  type Subscription {
	  bookAdded: Book!
  }
`

const resolvers = {
  Query: {
	  bookCount: ()=> Book.collection.countDocuments(),
	  allBooks: (root,args)=> {
		
		  const query = {}
		  if(args.genre){
			  query.genres = args.genre
		  }
		  let queryBooks = Book.find(query)
		  
		  
		  return queryBooks.populate('author')
	  },
	  favoriteGenreBooks: async (root,args,context)=>{ 
	  const user = await context.currentUser
	  return Book.find({genres:user.favoriteGenre}).populate('author',{name:1,born:1,_id:1})
	  },
	  authorCount: ()=> Author.collection.countDocuments(),
	  allAuthors: ()=> Author.find({}),
	  me: (root,args,context) => {
		 
		  return context.currentUser
	  }
  },
  Author: {
	  bookCount:  root => {
		   
		  
		  return  Book.countDocuments({author:root._id})
	  }
  }
  ,
  Mutation: {
	  addBook: async (root, args,context) => {
		  const currentUser = context.currentUser
		  if (!currentUser) {
			throw new AuthenticationError("not authenticated")
			}
		  let author = await Author.findOne({name:args.author})
		  console.log(author)
		  if(!author){
			  console.log('entred add')
			  author = new Author({
				  name:args.author
			  })
			  try {
			  await author.save()
			  } catch(error){
				  throw new UserInputError(error.message, {
					  invalidArgs:args
				  })
				  return null
			  }
			  
		  }
		 
		  const book = new Book ({
			  ...args,
			  author:author._id
		  })
		  try {
		  await book.save()
		  } catch(error){
				  throw new UserInputError(error.message, {
					  invalidArgs:args
				  })
			  }
		  
		  pubsub.publish('BOOK_ADDED',{ bookAdded:book})
		  
		  return book
	  }, 
	  editAuthor: async (root, args,context) => {
		  const currentUser = context.currentUser
		  if (!currentUser) {
			throw new AuthenticationError("not authenticated")
			}
		  const author = await Author.findOne({name:args.name})
		  author.born = args.setBornTo
		  try {
		  author.save()
		  } catch(error){
				  throw new UserInputError(error.message, {
					  invalidArgs:args
				  })
			  }
		  return author
	  },
	  createUser: (root, args) => {
		  const user = new User({ username: args.username,
		  favoriteGenre:args.favoriteGenre })

		  return user.save()
          .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
			  })
		  })
	},
	login: async (root, args) => {
    const user = await User.findOne({ username: args.username })
	console.log(user.username)
    if ( !user || args.password !== PASSWORD ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },
	  
  },
  Subscription : {
	  bookAdded : {
		  subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
	  },
  },
  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})