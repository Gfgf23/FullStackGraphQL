import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendation from './components/Recommendation'
import {useApolloClient} from '@apollo/client'
const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = async() => {
    console.log('entred logout')
	setPage('login')
    setToken(null)
	localStorage.clear()
	
    
    
  }
  
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
		{!token && <button onClick={() => setPage('login')}>login</button>}
		{token && <button onClick={() => setPage('add')}>add book</button>}
		{token && <button onClick={() => setPage('recommendation')}>recommendation</button>}
		{token && <button onClick={()=>{logout().then(()=>client.resetStore())}}>logout</button>}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
	  <LoginForm 
		show={page === 'login'}
		setToken={setToken}
		setPage={setPage}
	  />
	  
	  <Recommendation 
	  show={page === 'recommendation'}
	  />

    </div>
  )
}

export default App