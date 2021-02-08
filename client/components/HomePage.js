import React, {useState} from 'react'
import {Link} from 'react-router-dom'

const HomePage = () => {
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')

  return (
    <div>
      <div>
        <h1>Enter a neighborhood</h1>
        <div>
          <input
            placeholder="Neighborhood"
            type="text"
            onChange={event => setStart(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Destination"
            type="text"
            onChange={event => setDestination(event.target.value)}
          />
        </div>
        <Link
          onClick={event =>
            !start || !destination ? event.preventDefault() : null
          }
          to={`/search?start=${start}&destination=${destination}`}
        >
          <button type="submit">Let's go!</button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
