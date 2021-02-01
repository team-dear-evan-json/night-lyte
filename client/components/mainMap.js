import React from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import axios from 'axios'

class MainMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hour: 21,
      results: [],
      errorState: null,
      loading: true
    }
  }

  componentDidMount() {
    this.getBusinessesFromApi('Brooklyn, NY')
  }

  getBusinessesFromApi = async locationSearched => {
    this.setState({loading: true})

    await axios
      .get(
        `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?location=${locationSearched}`,
        {
          headers: {
            Authorization: `Bearer d7me82kfWORLA8U70CIdJzgNKTCzhv-aHEjhB7KNtggEeusVZublUF0AhHlaWsNhzoIfv9KJRPUy7wsK4KglKy2_7BRwVoG1UaRfpEBIz-rjnGM04210jy0hXj0YYHYx`
          },
          params: {
            limit: 50,
            open_at: 1612270800
          }
        }
      )
      .then(res => {
        console.log(res.data.businesses)
        this.setState({results: res.data.businesses, loading: false})
      })
      .catch(err => {
        console.log(err)
        this.setState({
          errorState: `Sorry we coudln't find information related to the location you search, do you want to try something else?`,
          loading: false
        })
      })
  }

  render() {
    console.log(this.state)
    let businessResults = this.state.results
    console.log('NEWLY', businessResults)
    return (
      <div>
        <MapContainer
          center={[40.708173, -73.996129]}
          zoom={12}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/kamalt/ckkkid04w2ub017npxtqfeckc/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
          />
          {businessResults.map(business => {
            return (
              <Marker
                position={[
                  business.coordinates.latitude,
                  business.coordinates.longitude
                ]}
              >
                <Popup>{business.name}</Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    )
  }
}

export default MainMap
