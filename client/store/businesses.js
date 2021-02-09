import axios from 'axios'

const SET_BUSINESSES = 'SET_BUSINESSES'

const setBusinesses = businesses => ({type: SET_BUSINESSES, businesses})

export const getBusinessesFromApi = (
  locationSearched,
  hour
) => async dispatch => {
  try {
    let total = 0
    let offset = 51
    const allData = []
    // const center = []
    const {data} = await axios.get(
      `${'https://corsanywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?location=${locationSearched}`,
      {
        headers: {
          accept: 'application/json',
          'x-requested-with': 'xmlhttprequest',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer d7me82kfWORLA8U70CIdJzgNKTCzhv-aHEjhB7KNtggEeusVZublUF0AhHlaWsNhzoIfv9KJRPUy7wsK4KglKy2_7BRwVoG1UaRfpEBIz-rjnGM04210jy0hXj0YYHYx`
        },
        params: {
          limit: 50,
          open_at: hour
        }
      }
    )
    allData.push(...data.businesses)
    total = data.total
    // center = [data.region.center.lat, ata.region.center.lng]
    console.log('data total!!!!!!!', data)
    // while (total > 0) {
    //   const {data} = await axios.get(
    //     `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?location=${locationSearched}`,
    //     {
    //       headers: {
    //         accept: 'application/json',
    //         'x-requested-with': 'xmlhttprequest',
    //         'Access-Control-Allow-Origin': '*',
    //         Authorization: `Bearer d7me82kfWORLA8U70CIdJzgNKTCzhv-aHEjhB7KNtggEeusVZublUF0AhHlaWsNhzoIfv9KJRPUy7wsK4KglKy2_7BRwVoG1UaRfpEBIz-rjnGM04210jy0hXj0YYHYx`,
    //       },
    //       params: {
    //         limit: 50,
    //         offset: offset,
    //         open_at: hour,
    //       },
    //     }
    //   )
    //   allData.push(...data.businesses)
    //   total -= 50
    //   offset += 50
    // }
    console.log('allData!!!!', allData)
    dispatch(setBusinesses(allData))
  } catch (err) {
    console.error('error in setBusinesses thunk', err)
  }
}

// getBusinessesFromApi = async (locationSearched) => {
//   this.setState({loading: true})

//     .then((res) => {
//       this.setState({
//         results: res.data.businesses,
//         loading: false,
//         firstLatitude: res.data.businesses[0].coordinates.latitude,
//         firstLongitude: res.data.businesses[0].coordinates.longitude,
//       })
//     })
//     .catch((error) => {
//       console.log(error.response)
//       this.setState({
//         errorState: `Sorry we coudln't find information related to the location you search, do you want to try something else?`,
//         loading: false,
//       })
//     })
// }

export default function(state = [], action) {
  switch (action.type) {
    case SET_BUSINESSES:
      return action.businesses
    default:
      return state
  }
}
