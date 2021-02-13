import axios from 'axios'

//Action type
const GET_DAMAGED_LIGHTS = 'GET_DAMAGED_LIGHTS'

//Initial state
const defaultLights = []

//Action creator
const getDamagedLights = lights => ({type: GET_DAMAGED_LIGHTS, lights})

/**
 * THUNK CREATORS
 */

export const fetchLightsFromApi = coords => async dispatch => {
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
      `https://data.cityofnewyork.us/resource/diik-ryem.json?$where=within_circle(location, ${coords},500)`,
      config
    )
    dispatch(getDamagedLights(res.data || defaultLights))
  } catch (err) {
    console.error('Error in Lights thunk', err)
  }
}

/**
 * REDUCER
 */

export default function(state = defaultLights, action) {
  switch (action.type) {
    case GET_DAMAGED_LIGHTS:
      return [action.lights]
    default:
      return state
  }
}
