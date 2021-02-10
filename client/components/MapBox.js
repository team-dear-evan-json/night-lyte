import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
// import {businesses, geojson} from '../../dummyData/businesses'
import {getBusinessesFromApi} from '../store/businesses'
import {fetchCrimesFromApi} from '../store/crimes'
import {connect} from 'react-redux'
import Slider from './Slider'

function arrayToGeoJson(array) {}

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

    map.on('load', async () => {
      //create crime layer
      await this.props.loadAllCrimes()
      const crimesGeoJson = this.props.crimes[0].map(element => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [Number(element.longitude), Number(element.latitude)],
            type: 'Point'
          }
        }
      })
      map.addSource('crime', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: crimesGeoJson
        }
      })
      map.addLayer({
        id: 'Crimes',
        type: 'circle',
        source: 'crime',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        }
      })
    })

    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      this.setState({geoAddress: geoAddress})

      //create yelp layer
      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      const yelpGeoJson = this.props.businesses.map(element => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [
              element.coordinates.longitude,
              element.coordinates.latitude
            ],
            type: 'Point'
          }
        }
      })
      map.addSource('yelp', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: yelpGeoJson
        }
      })
      map.addLayer({
        id: 'Open Businesses',
        type: 'circle',
        source: 'yelp',
        paint: {
          'circle-radius': 18,
          'circle-color': '#E9C37B',
          'circle-opacity': 0.6
        }
        // filter: ['==', '$type', 'Point'],
      })

      // this.props.businesses.forEach(business => {
      //   new mapboxgl.Marker()
      //     .setLngLat([
      //       business.coordinates.longitude,
      //       business.coordinates.latitude
      //     ])
      //     .addTo(map)
      // })
      // await this.props.loadAllCrimes()
      // this.props.crimes[0].map(crime =>
      //   new mapboxgl.Marker()
      //     .setLngLat([crime.longitude, crime.latitude])
      //     .addTo(map)
      // )
    })
    // enumerate ids of the layers
    const toggleableLayerIds = ['Open Businesses', 'Crimes']

    // set up the corresponding toggle button for each layer
    for (let i = 0; i < toggleableLayerIds.length; i++) {
      const id = toggleableLayerIds[i]

      const link = document.createElement('a')
      link.href = '#'
      link.className = ''
      link.textContent = id

      link.onclick = function(e) {
        const clickedLayer = this.textContent
        e.preventDefault()
        e.stopPropagation()

        const visibility = map.getLayoutProperty(clickedLayer, 'visibility')

        // toggle layer visibility by changing the layout object's visibility property
        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none')
          this.className = ''
        } else {
          this.className = 'active'
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible')
        }
      }

      const layers = document.getElementById('menu')
      layers.appendChild(link)
    }
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

    // const layerStyle = {
    //   id: 'point',
    //   type: 'circle',
    //   paint: {
    //     'circle-radius': 10,
    //     'circle-color': '#007cbf',
    //   },
    // }
  }

  // handleClick = () => {
  //   //   // toggle visibility based on type
  //   this.setState({visibility: !this.state.visibility}) // use setLayoutProperty
  // }

  render() {
    return (
      // Populates map by referencing map's container property
      <div>
        <div id="menu" />
        <Slider />
        {/* <CrimesMap /> */}
        {/* <button onClick={this.handleClick}>business</button>
        <button onClick={this.handleClick}>crome</button> */}
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
            {this.state.zoom} | Address:
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
    loadAllCrimes: () => dispatch(fetchCrimesFromApi()),
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
