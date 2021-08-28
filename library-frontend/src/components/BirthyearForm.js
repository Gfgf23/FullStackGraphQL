import React,{useState} from 'react'
import {UPDATE_AUTHOR,ALL_AUTHORS} from './queries'
import {useMutation} from '@apollo/client'
import Select from 'react-select'

const BirthyearForm = ({authors}) => {
	const [name,setName] = useState()
	const [born,setBorn] = useState('')
	
	const options = authors.map(a => {return {value:a.name,label:a.name}})
	const [updateAuthor] =  useMutation(UPDATE_AUTHOR,{refetchQueries:[{query:ALL_AUTHORS}]})
	
	const submit = async(event) => {
		event.preventDefault()
		updateAuthor({variables:{name:name.value,born:Number(born)}})
		setName(null)
		setBorn('')
	}
	
	return(
	<form onSubmit={submit}>
	<Select 
	defaultValue={name}
	onChange={setName}
	options={options}
	/>
	<div>born</div>
	<input type='text' value={born} onChange={ ({target}) => setBorn(target.value) } />
	<button type='submit'>Change born </button>
	</form>
	)
	
}

export default BirthyearForm