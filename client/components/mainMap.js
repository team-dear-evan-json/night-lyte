import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import queryString from 'query-string'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  LayersControl
} from 'react-leaflet'
import axios from 'axios'
import MainMapDummy from './mainMapDummy'
import businesses, {getBusinessesFromApi} from '../store/businesses'

class MainMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hourToRender: 1612270800,
      address: '',
      yelpResults: [],
      errorState: null,
      loading: true
    }
  }

  async componentDidMount() {
    try {
      let decodedUrl = await queryString.parse(location.search)
      console.log('decodedUrl address: ', decodedUrl.address)
      await this.props.getBusinessesFromApi(
        decodedUrl.address,
        this.state.hourToRender
      )
      this.setState({address: decodedUrl})
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    // let businessResults = this.state.results
    // console.log('Long and lat results: ', [
    //   this.state.firstLatitude,
    //   this.state.firstLongitude,
    // ])

    return (
      <div>
        <MapContainer
          // center={[this.state.firstLatitude, this.state.firstLongitude]}

          center={[40.708173, -73.996129]}
          zoom={12}
          scrollWheelZoom={false}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenBusinesses">
              <TileLayer
                url="https://api.mapbox.com/styles/v1/kamalt/ckkoarmdr0uxx17qq5qysvnnl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
                attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Business">
              {this.props.businesses.map(business => {
                return (
                  <Circle
                    key={business.id}
                    center={[
                      business.coordinates.latitude,
                      business.coordinates.longitude
                    ]}
                    radius={18}
                    stroke={false}
                    fill={true}
                    fillColor="#E9C37B"
                    fillOpacity={0.8}
                  >
                    <Popup>{business.name}</Popup>
                  </Circle>
                )
              })}
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    )
  }
}

const mapState = state => {
  return {
    businesses: state.businesses
  }
}

const mapDispatch = dispatch => {
  return {
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MainMap)
