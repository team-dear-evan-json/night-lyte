import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
// import {businesses, geojson} from '../../dummyData/businesses'
import {getBusinessesFromApi} from '../store/businesses'
import {fetchCrimesFromApi} from '../store/crimes'
import {connect} from 'react-redux'
// import ReactMapGL, {Source, Layer} from 'react-mapbox-gl'

mapboxgl.accessToken =
  'pk.eyJ1IjoicmFmYWVsYW5kcmVzNTQiLCJhIjoiY2todXR1enlqMDltYjJxbWw4dnp4aDZrYyJ9.rP9cSw3nVs_ysNYCemYwKw'

class MapBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      longitude: -74.00934,
      latitude: 40.70531,
      zoom: 14,
      geoAddress: ''
    }
  }

  async componentDidMount() {
    // Creates new map instance
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-74.00934, 40.70531],
      zoom: 12
    })
    // Creates a geo search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
    map.addControl(geocoder, 'top-right')

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    })
    // Integrates directions control with map
    map.addControl(directions, 'top-right')

    // SEARCH FIELD: Creates Search result listner and saves input address to state
    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      const geoCoords = result.geometry.coordinates
      this.setState({geoAddress: geoAddress})

      // Makes a marker for each business and adds to map
      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      this.props.businesses.forEach(business => {
        const businessMarker = document.createElement('div')
        businessMarker.className = 'businessMarker'
        new mapboxgl.Marker(businessMarker)
          .setLngLat([
            business.coordinates.longitude,
            business.coordinates.latitude
          ])
          .addTo(map)
      })

      // Makes a maker for each crime and adds to map
      const crimeCoords = `${geoCoords[1]}, ${geoCoords[0]}`
      await this.props.loadAllCrimes(crimeCoords)
      this.props.crimes[0].map(crime => {
        const crimeMarker = document.createElement('div')
        crimeMarker.className = 'crimeMarker'
        new mapboxgl.Marker(crimeMarker)
          .setLngLat([crime.longitude, crime.latitude])
          .addTo(map)
      })
    })

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(6),
        lat: map.getCenter().lat.toFixed(6),
        zoom: map.getZoom().toFixed(2)
      })
    })
  }
  render() {
    return (
      // Populates map by referencing map's container property
      <div>
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        <div className="sidebarStyle">
          <div>
            page: /markers | Longitude: {this.state.lng} | Latitude:{' '}
            {this.state.lat} | Zoom: {this.state.zoom} | Address:
            {this.state.geoAddress}
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    businesses: state.businesses,
    crimes: state.crimes
  }
}

const mapDispatch = dispatch => {
  return {
    loadAllCrimes: coords => dispatch(fetchCrimesFromApi(coords)),
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
