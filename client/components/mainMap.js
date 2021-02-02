import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import {MapContainer, TileLayer, Marker, Popup, Circle} from 'react-leaflet'
import axios from 'axios'

class MainMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      results: [],
      errorState: null,
      loading: true,
      firstLatitude: 0,
      firstLongitude: 0
    }
  }

  async componentDidMount() {
    let decodedUrl = await queryString.parse(location.search)
    console.log('decodedUrl address: ', decodedUrl.address)
    await this.getBusinessesFromApi(decodedUrl.address)
  }

  getBusinessesFromApi = async locationSearched => {
    this.setState({loading: true})

    await axios
      .get(
        `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?location=${locationSearched}`,
        {
          headers: {
            accept: 'application/json',
            'x-requested-with': 'xmlhttprequest',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer d7me82kfWORLA8U70CIdJzgNKTCzhv-aHEjhB7KNtggEeusVZublUF0AhHlaWsNhzoIfv9KJRPUy7wsK4KglKy2_7BRwVoG1UaRfpEBIz-rjnGM04210jy0hXj0YYHYx`
          },
          params: {
            limit: 20,
            open_at: 1612270800
          }
        }
      )
      .then(res => {
        this.setState({
          results: res.data.businesses,
          loading: false,
          firstLatitude: res.data.businesses[0].coordinates.latitude,
          firstLongitude: res.data.businesses[0].coordinates.longitude
        })
      })
      .catch(error => {
        console.log(error.response)
        this.setState({
          errorState: `Sorry we coudln't find information related to the location you search, do you want to try something else?`,
          loading: false
        })
      })
  }

  render() {
    let businessResults = this.state.results
    console.log('Long and lat results: ', [
      this.state.firstLatitude,
      this.state.firstLongitude
    ])
    return (
      <div>
        <MapContainer
          // center={[this.state.firstLatitude, this.state.firstLongitude]}
          center={[40.708173, -73.996129]}
          zoom={12}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/kamalt/ckkoarmdr0uxx17qq5qysvnnl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
          />
          {businessResults.map(business => {
            return (
              <Circle
                key={business.id}
                center={[
                  business.coordinates.latitude,
                  business.coordinates.longitude
                ]}
                radius={18}
                stroke={false}
                // color="#E9C37B"
                fill={true}
                fillColor="#E9C37B"
                fillOpacity={0.8}
              >
                <Popup>{business.name}</Popup>
              </Circle>
            )
          })}
        </MapContainer>
      </div>
    )
  }
}

export default MainMap
