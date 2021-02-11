import axios from 'axios'

//Action type
const GET_ENTRANCES = 'GET_ENTRANCES'

//Initial state
const defaultEntrances = []

//Action creator
const getEntrances = entrances => ({type: GET_ENTRANCES, entrances})

//Thunk

export const fetchEntrancesFromApi = coors => async dispatch => {
  const config = {
    method: 'GET',
    body: JSON.stringify({
      $limit: 5000
    }),
    headers: {
      'Content-type': 'application/json'
    }
  }
  try {
    const res = await axios.get(
      `https://data.cityofnewyork.us/resource/he7q-3hwy.json?$where=within_circle(the_geom, ${coors}, 1000)`,
      config
    )
    dispatch(getEntrances(res.data || defaultEntrances))
  } catch (error) {
    console.error('Error is in get Entrances thunk', error)
  }
}

//Reducer

export default function(state = defaultEntrances, action) {
  switch (action.type) {
    case GET_ENTRANCES:
      return [action.entrances]
    default:
      return state
  }
}
