import React, {useState} from 'react'
import {Link} from 'react-router-dom'

const HomePage = () => {
  const [address, setAddress] = useState('')

  return (
    <div>
      <div>
        <h1>Enter a neighborhood</h1>
        <div>
          <input
            placeholder="Neighborhood"
            type="text"
            onChange={event => setAddress(event.target.value)}
          />
        </div>
        <Link
          onClick={event => (!address ? event.preventDefault() : null)}
          to={`/search?address=${address}`}
        >
          <button type="submit">Let's go!</button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
