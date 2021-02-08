// import * as React from 'react'
// import {Component} from 'react'
// import MapGL from 'react-map-gl'
// // import mapboxgl from 'mapbox-gl'
// import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
// import {businesses, geojson} from '../../dummyData/businesses'
// import {connect} from 'react-redux'
// import {getBusinessesFromApi} from '../store/businesses'

// const MAPBOX_TOKEN =
//   'pk.eyJ1IjoicmFmYWVsYW5kcmVzNTQiLCJhIjoiY2todXR1enlqMDltYjJxbWw4dnp4aDZrYyJ9.rP9cSw3nVs_ysNYCemYwKw'

// class MapBox extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       viewport: {
//         latitude: 40.748514,
//         longitude: -73.985664,
//         zoom: 12,
//       },
//       address: '1 pike, new york',
//       hourForYelp: 1612825200,
//     }
//   }

//   async componentDidMount() {
//     const mapboxobj = this.mapWrapper.getMap()
//     // Creates new directions control instance
//     const directions = new MapboxDirections({
//       accessToken: MAPBOX_TOKEN,
//       unit: 'metric',
//       profile: 'mapbox/walking',
//     })
//     // Integrates directions control with map
//     mapboxobj.addControl(directions, 'top-left')

//     await this.props.getBusinessesFromApi(
//       this.state.address,
//       this.state.hourForYelp
//     )
//     // console.log('this.props.businesses:', this.props.businesses)
//     this.props.businesses.forEach((business) => {
//       const marker = new mapboxgl.Marker()
//         .setLngLat([
//           business.coordinates.longitude,
//           business.coordinates.latitude,
//         ])
//         .addTo(mapboxobj)
//     })
//   }

//   render() {
//     return (
//       <MapGL
//         ref={(el) => (this.mapWrapper = el)}
//         {...this.state.viewport}
//         width="100vw"
//         height="100vh"
//         mapStyle="mapbox://styles/mapbox/dark-v9"
//         onViewportChange={(viewport) => this.setState({viewport})}
//         mapboxApiAccessToken={MAPBOX_TOKEN}
//       />
//     )
//   }
// }

// const mapState = (state) => {
//   return {
//     businesses: state.businesses,
//   }
// }

// const mapDispatch = (dispatch) => {
//   return {
//     getBusinessesFromApi: (inputAddress, hour) =>
//       dispatch(getBusinessesFromApi(inputAddress, hour)),
//   }
// }
// export default connect(mapState, mapDispatch)(MapBox)

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
      zoom: 14
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

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    })

    // Integrates directions control with map
    map.addControl(directions, 'top-left')

    // const marker = new mapboxgl.Marker()
    //   .setLngLat([-73.985664, 40.748514])
    //   .addTo(map)
    // const marker2 = new mapboxgl.Marker()
    //   .setLngLat([-73.998738, 40.719745])
    //   .addTo(map)
    await this.props.getBusinessesFromApi('1 pike, new york', 1612825200)

    const layerStyle = {
      id: 'point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
      }
    }
    this.props.businesses.forEach(business => {
      const marker2 = new mapboxgl.Marker()
        .setLngLat([
          business.coordinates.longitude,
          business.coordinates.latitude
        ])
        .addTo(map)
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
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
            {this.state.zoom}
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
