import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections, {
  setOriginFromCoordinates
} from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
// import {businesses, geojson} from '../../dummyData/businesses'
import {getBusinessesFromApi} from '../store/businesses'
import {fetchEntrancesFromApi} from '../store/entrances'
import {fetchCrimesFromApi} from '../store/crimes'
import {connect} from 'react-redux'

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

      // await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      // this.props.businesses.forEach((business) => {
      //   new mapboxgl.Marker()
      //     .setLngLat([
      //       business.coordinates.longitude,
      //       business.coordinates.latitude,
      //     ])
      //     .addTo(map)
      // })

      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      const yelpGeoJson = this.props.businesses.map(business => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [
              business.coordinates.longitude,
              business.coordinates.latitude
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
        layout: {
          // make layer visible by default
          visibility: 'visible'
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#E9C37B',
          'circle-opacity': 0.6
        }
      })

      // await this.props.loadAllCrimes()
      // this.props.crimes[0].map((crime) =>
      //   new mapboxgl.Marker()
      //     .setLngLat([crime.longitude, crime.latitude])
      //     .addTo(map)
      // )

      await this.props.loadAllCrimes()
      const crimesGeoJson = this.props.crimes[0].map(crime => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [crime.longitude, crime.latitude],
            type: 'Point'
          }
        }
      })
      map.addSource('crimedata', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: crimesGeoJson
        }
      })
      map.addLayer({
        id: 'Crime Cases',
        type: 'circle',
        source: 'crimedata',
        layout: {
          // make layer visible by default
          visibility: 'visible'
        },
        paint: {
          'circle-radius': 8,
          'circle-color': 'red',
          'circle-opacity': 1.0
        }
      })

      // await this.props.loadEntrances()
      // this.props.entrances[0].map((entrance) =>
      //   new mapboxgl.Marker()
      //     .setLngLat([
      //       entrance.the_geom.coordinates[0],
      //       entrance.the_geom.coordinates[1],
      //     ])
      //     .addTo(map)
      // )

      await this.props.loadEntrances()
      const entrancesGeoJson = this.props.entrances[0].map(entrance => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [
              entrance.the_geom.coordinates[0],
              entrance.the_geom.coordinates[1]
            ],
            type: 'Point'
          }
        }
      })
      map.addSource('subwaydata', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: entrancesGeoJson
        }
      })
      map.addLayer({
        id: 'Subway Entrances',
        type: 'circle',
        source: 'subwaydata',
        layout: {
          // make layer visible by default
          visibility: 'visible'
        },
        paint: {
          'circle-radius': 8,
          'circle-color': 'green',
          'circle-opacity': 1.0
        }
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
      <div>
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
    businesses: state.businesses,
    crimes: state.crimes,
    entrances: state.entrances
  }
}

const mapDispatch = dispatch => {
  return {
    loadEntrances: () => dispatch(fetchEntrancesFromApi()),
    loadAllCrimes: () => dispatch(fetchCrimesFromApi()),
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
