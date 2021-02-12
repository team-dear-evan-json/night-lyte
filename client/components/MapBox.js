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

    // Setting map data layers
    map.on('load', () => {
      //yelp layer
      map.addSource('yelp', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
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
      map.moveLayer('Open Businesses')
      //crimes layer
      map.addSource('crimes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      map.addLayer({
        id: 'Crime Cases',
        type: 'circle',
        source: 'crimes',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        },
        layout: {
          visibility: 'none'
        }
      })
      map.moveLayer('Crime Cases')

      //subway layer
      map.addSource('entrances', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      map.addLayer({
        id: 'Subway Entrances',
        type: 'circle',
        source: 'entrances',
        paint: {
          'circle-radius': 6,
          'circle-color': 'green'
        },
        layout: {
          visibility: 'none'
        }
      })
      map.moveLayer('Subway Entrances')
    })

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
      map
        .getSource('yelp')
        .setData({type: 'FeatureCollection', features: yelpGeoJson})

      // this is for popups!!!!! //
      map.on('mouseenter', 'Open Businesses', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer'

        var coordinates = e.features[0].geometry.coordinates.slice()
        var description = e.features[0].properties.description

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map)
      })
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      map.on('mouseleave', 'Open Businesses', function() {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })

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
      map
        .getSource('crimes')
        .setData({type: 'FeatureCollection', features: crimesGeoJson})
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
      map
        .getSource('entrances')
        .setData({type: 'FeatureCollection', features: entranceGeoJson})
    })
    //Layers Filter
    // enumerate ids of the layers
    const toggleableLayerIds = [
      'Open Businesses',
      'Crime Cases',
      'Subway Entrances'
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
      <div>
        <div id="menu" />
        <Slider />
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
