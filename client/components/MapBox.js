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
      longitude: -122.45,
      latitude: 37.78,
      zoom: 14,
      geoAddress: ''
      // visibility: 'visible',
    }
  }

  async componentDidMount() {
    // Creates new map instance
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-73.985664, 40.748514],
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

    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      this.setState({geoAddress: geoAddress})
      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      this.props.businesses.forEach(business => {
        const marker = new mapboxgl.Marker()
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

    // // Adds layer
    // map.addSource('businesses', {
    //   type: 'vector',
    //   url: 'mapbox://mapbox.2opop9hr',
    // })

    // map.addLayer({
    //   id: 'businesses',
    //   type: 'circle',
    //   source: 'businesses',
    //   layout: {
    //     // make layer visible by default
    //     visibility: this.state.visibility,
    //   },
    //   paint: {
    //     'circle-radius': 8,
    //     'circle-color': 'rgba(55,148,179,1)',
    //   },
    //   'source-layer': 'businesses-cusco',
    // })

    const layerStyle = {
      id: 'point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
      }
    }
  }

  // handleClick = () => {
  //   //   // toggle visibility based on type
  //   this.setState({visibility: !this.state.visibility}) // use setLayoutProperty
  // }

  render() {
    return (
      // Populates map by referencing map's container property
      <div>
        {/* <button onClick={this.handleClick}>business</button>
        <button onClick={this.handleClick}>crome</button> */}
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper">
          <div className="sidebarStyle">
            <div>
              Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
              {this.state.zoom} | geoAddress:
              {this.state.geoAddress}
            </div>
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
