import React,{useState,useEffect} from 'react'
import {ALL_BOOKS} from './queries'
import {useQuery} from '@apollo/client'
const Books = (props) => {
  const [genre,setGenre] = useState('')
  const result = useQuery(ALL_BOOKS,{fetchPolicy: "network-only"})
  const genres = ['crime','refactoring']
  
  if (!props.show) {
    return null
  }
  if(result.loading){
	  return (<div>Loading</div>)
  }
  
  const books = genre !== '' ? result.data.allBooks.filter(a => a.genres.includes(genre)) : result.data.allBooks

  return (
    <div>
      <h2>books</h2>
	  {genre !== '' && <p> you are in genre <b>{genre}</b> </p>}
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
	  {genres.map(g => <button key={g} onClick={()=>setGenre(g)}>{g}</button>)}
	  <button onClick={()=>setGenre('')}>All genres</button>
    </div>
  )
}

export default Books