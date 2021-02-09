import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CRIMES = 'GET_CRIMES'

//Initial state
const defaultCrimes = []

/**
 * ACTION CREATORS
 */
const getCrimes = crimes => ({type: GET_CRIMES, crimes})

/**
 * THUNK CREATORS
 */

export const fetchCrimesFromApi = () => async dispatch => {
  const config = {
    method: 'GET',
    body: JSON.stringify({
      $limit: 5000
      //   app_token: 'pIBlRdatT2tBGvefMsQqjlywQ',
    }),
    headers: {
      'Content-type': 'application/json'
    }
  }

  try {
    const res = await axios.get(
      `https://data.cityofnewyork.us/resource/qsur-nxze.json?$limit=50`,
      config
    )
    dispatch(getCrimes(res.data || defaultCrimes))
  } catch (err) {
    console.error('Error in getCrimes thunk', err)
  }
}

/**
 * REDUCER
 */

export default function(state = defaultCrimes, action) {
  switch (action.type) {
    case GET_CRIMES:
      return [action.crimes]
    default:
      return state
  }
}
