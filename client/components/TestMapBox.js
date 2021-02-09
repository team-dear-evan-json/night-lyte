import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import {businesses, geojson} from '../../dummyData/businesses'
import {getBusinessesFromApi} from '../store/businesses'
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

    // --- MARKER TEST ----
    const businessMarker = new mapboxgl.Marker({
      element: this.businessMarkerWrapper
    })
    // --------------------

    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      this.setState({geoAddress: geoAddress})
      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      this.props.businesses.forEach(business => {
        // --- MARKER TEST ----
        businessMarker
          // --------------------
          .setLngLat([
            business.coordinates.longitude,
            business.coordinates.latitude
          ])
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

    // --- MARKER TEST ----
    //Works!!
    // const marker = new mapboxgl.Marker({
    //   element: this.businessMarkerWrapper,
    // })
    //   .setLngLat([-74.00934, 40.70531])
    //   .addTo(map)

    //Attempt 1:
    // const element = document.createElement('div')
    // element.className = 'test-marker'
    // console.log(`>>>>`, typeof elmemt)
    // element.style.backgroundImage = 'url(images/icon.png)'
    // new mapboxgl.Marker(element).setLngLat([-74.00934, 40.70531]).addTo(map)

    //Attempt 2:
    // new mapboxgl.Marker({
    //   element: <img className="icon" src='../images/icon.png' />
    // }).setLngLat([-74.00934, 40.70531]).addTo(map)

    // Attempt 3:

    // --------------------
  }
  render() {
    return (
      // Populates map by referencing map's container property
      <div>
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        {/* --- MARKER TEST ---- */}
        <div
          ref={el => (this.businessMarkerWrapper = el)}
          className="businessMarkerWrapper"
        />
        {/* -------------------- */}
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
    businesses: state.businesses
  }
}

const mapDispatch = dispatch => {
  return {
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
