import React from 'react'
import {FAVORITE_GENRE_BOOKS,ME} from './queries'
import {useQuery} from '@apollo/client'

const Recommendation = (props) => {
	const result = useQuery(ME,{fetchPolicy: "network-only"})
    
	
	if (!props.show) {
    return null
  }
	if(result.loading){
	  return (<div>Loading</div>)
  }
    
 
  console.log(result)
  const books = result.data.favoriteGenre
  
  return (
  <div>
  <h1>recommendations</h1>
  <p>Books in your favorite genre </p>
  
   <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
  </div>
  )
}

export default Recommendation