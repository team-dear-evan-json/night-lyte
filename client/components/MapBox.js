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

    map.addControl(directions, 'top-right')

    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      const geoCoords = result.geometry.coordinates
      const geoCoors = result.geometry.coordinates
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
          },
          properties: {
            name: element.name,
            address: element.location.address1
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
      })
      // this is for popups!!!!! //
      // map.on('click', 'Open Businesses', function (e) {
      //   const coordinates = e.features[0].geometry.coordinates.slice()
      //   const description = e.features[0].properties.description

      //   // Ensure that if the map is zoomed out such that multiple
      //   // copies of the feature are visible, the popup appears
      //   // over the copy being pointed to.
      //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      //   }

      //   new mapboxgl.Popup()
      //     .setLngLat(coordinates)
      //     .setHTML(description)
      //     .addTo(map)
      // })

      // // Change the cursor to a pointer when the mouse is over the places layer.
      // map.on('mouseenter', 'Open Businesses', function () {
      //   map.getCanvas().style.cursor = 'pointer'
      // })

      // // Change it back to a pointer when it leaves.
      // map.on('mouseleave', 'Open Businesses', function () {
      //   map.getCanvas().style.cursor = ''
      // })

      //create crime layer
      const crimeCoords = `${geoCoords[1]}, ${geoCoords[0]}`
      await this.props.loadAllCrimes(crimeCoords)
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
        id: 'Crime cases',
        type: 'circle',
        source: 'crime',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        },
        layout: {
          visibility: 'none'
        }
      })

      //create entrances layer

      const entranceCoordinates = `${geoCoors[1]}, ${geoCoors[0]}`
      await this.props.loadEntrances(entranceCoordinates)
      const entranceGeoJson = this.props.entrances[0].map(entrance => {
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
      map.addSource('entrance', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: entranceGeoJson
        }
      })
      map.addLayer({
        id: 'Subway entrances',
        type: 'circle',
        source: 'entrance',
        paint: {
          'circle-radius': 6,
          'circle-color': 'green'
        },
        layout: {
          visibility: 'none'
        }
      })
    })

    //Layers Filter
    // enumerate ids of the layers
    const toggleableLayerIds = [
      'Open Businesses',
      'Crime cases',
      'Subway entrances'
    ]

    // set up the corresponding toggle button for each layer
    for (let i = 0; i < toggleableLayerIds.length; i++) {
      const id = toggleableLayerIds[i]

      const link = document.createElement('a')
      link.href = '#'
      if (id === 'Open Businesses') {
        link.className = 'active'
      } else {
        link.className = ''
      }
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
  }

  render() {
    return (
      <div className="map-container">
        <div id="menu" />
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
    crimes: state.crimes,
    entrances: state.entrances
  }
}

const mapDispatch = dispatch => {
  return {
    loadEntrances: coors => dispatch(fetchEntrancesFromApi(coors)),
    loadAllCrimes: coords => dispatch(fetchCrimesFromApi(coords)),
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
