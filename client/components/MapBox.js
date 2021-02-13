import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import {getBusinessesFromApi} from '../store/businesses'
import {fetchEntrancesFromApi} from '../store/entrances'
import {fetchCrimesFromApi} from '../store/crimes'
import {fetchLightsFromApi} from '../store/lights'
import {connect} from 'react-redux'
import Slider from './Slider'

mapboxgl.accessToken =
  'pk.eyJ1IjoicmFmYWVsYW5kcmVzNTQiLCJhIjoiY2todXR1enlqMDltYjJxbWw4dnp4aDZrYyJ9.rP9cSw3nVs_ysNYCemYwKw'

class MapBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      longitude: -122.45,
      latitude: 37.78,
      zoom: 14,
      geoAddress: '',
      crimeFeatures: [],
      businessFeatures: [],
      subwayFeatures: [],
      lightsFeatures: [],
      map: {}
    }
    this.clearMap = this.clearMap.bind(this)
  }
  async componentDidMount() {
    ///// Map set up /////
    // the bounding box for the map and the geo search. first 2 elements are south-west coords, second 2 are north-east.
    const bbox = [-74.308351, 40.446138, -73.663318, 40.927802]
    // Creates new map instance
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-73.985664, 40.748514],
      zoom: 12,
      maxBounds: bbox
    })
    this.setState({map: map})
    // Creates a geo search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      bbox: bbox
    })
    map.addControl(geocoder, 'top-left')

    // Creates a directions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    })

    map.addControl(directions, 'top-left')

    ///// Setting map data layers /////
    map.on('load', () => {
      //yelp layer
      map.addSource('yelp', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.state.businessFeatures
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

      //crimes layer
      map.addSource('crimes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.state.crimeFeatures
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

      //subway layer
      map.addSource('subwayEntrances', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.state.subwayFeatures
        }
      })
      map.addLayer({
        id: 'Subway Entrances',
        type: 'circle',
        source: 'subwayEntrances',
        paint: {
          'circle-radius': 6,
          'circle-color': '#2360A5'
        },
        layout: {
          visibility: 'none'
        }
      })

      //lights layer
      map.addSource('lights', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.state.lightsFeatures
        }
      })
      map.addLayer({
        id: 'Street Lights Reports',
        type: 'circle',
        source: 'lights',
        paint: {
          'circle-radius': 6,
          'circle-color': 'green'
        },
        layout: {
          visibility: 'none'
        }
      })

      ///// Set Up Popups /////
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      ///// Popups for yelp /////
      const layers = [
        'Open Businesses',
        'Crime Cases',
        'Subway Entrances',
        'Street Lights Reports'
      ]
      layers.forEach(layer => {
        map.on('mouseenter', layer, function(e) {
          map.getCanvas().style.cursor = 'pointer'

          const coordinates = e.features[0].geometry.coordinates.slice()
          const description = e.features[0].properties.description

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }

          popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map)
        })

        map.on('mouseleave', layer, function() {
          map.getCanvas().style.cursor = ''
          popup.remove()
        })
      })
    })

    ///// Set up functionality after an area has been searched /////
    geocoder.on('result', async ({result}) => {
      const geoAddress = result.place_name
      const geoCoords = result.geometry.coordinates

      this.setState({geoAddress: geoAddress})

      //Set data to business layer
      await this.props.getBusinessesFromApi(geoAddress, 1612825200)
      const yelpGeoJson = this.props.businesses.map(function(element) {
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
            description: `Name: ${element.name},
            Address: ${element.location.address1}`
          }
        }
      })
      const previousBusinessFeatures = this.state.businessFeatures
      this.setState({
        businessFeatures: [...previousBusinessFeatures, ...yelpGeoJson]
      })
      map.getSource('yelp').setData({
        type: 'FeatureCollection',
        features: this.state.businessFeatures
      })

      //set data to crime layer
      const crimeCoords = `${geoCoords[1]}, ${geoCoords[0]}`
      await this.props.loadAllCrimes(crimeCoords)
      const crimesGeoJson = this.props.crimes[0].map(element => {
        const crimeDate = element.arrest_date.slice(0, 10)
        return {
          type: 'Feature',
          geometry: {
            coordinates: [Number(element.longitude), Number(element.latitude)],
            type: 'Point'
          },
          properties: {
            description: `Reported on: ${crimeDate}`
          }
        }
      })
      const previousCrimeFeatures = this.state.crimeFeatures
      this.setState({
        crimeFeatures: [...previousCrimeFeatures, ...crimesGeoJson]
      })
      map.getSource('crimes').setData({
        type: 'FeatureCollection',
        features: this.state.crimeFeatures
      })

      //set data to subway entrances layer
      const entranceCoordinates = `${geoCoords[1]}, ${geoCoords[0]}`
      await this.props.loadEntrances(entranceCoordinates)
      const entranceGeoJson = this.props.subwayEntrances[0].map(entrance => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [
              entrance.the_geom.coordinates[0],
              entrance.the_geom.coordinates[1]
            ],
            type: 'Point'
          },
          properties: {
            description: `Station name: ${entrance.name}, 
            Lines: ${entrance.line}`
          }
        }
      })
      const previousSubwayFeatures = this.state.subwayFeatures
      this.setState({
        subwayFeatures: [...previousSubwayFeatures, ...entranceGeoJson]
      })
      map.getSource('subwayEntrances').setData({
        type: 'FeatureCollection',
        features: this.state.subwayFeatures
      })

      //set data to Street lights report layer
      const lightsCoordinates = `${geoCoords[1]}, ${geoCoords[0]}`
      await this.props.loadLights(lightsCoordinates)

      const lightsGeoJson = this.props.lights[0].map(light => {
        return {
          type: 'Feature',
          geometry: {
            coordinates: [light.location.longitude, light.location.latitude],
            type: 'Point'
          },
          properties: {
            description: `Condition: ${light.descriptor}, Status: ${
              light.status
            }`
          }
        }
      })
      const previousLightsFeatures = this.state.lightsFeatures
      this.setState({
        lightsFeatures: [...previousLightsFeatures, ...lightsGeoJson]
      })

      map.getSource('lights').setData({
        type: 'FeatureCollection',
        features: this.state.lightsFeatures
      })
    })

    ///// Layers Filter /////
    const toggleableLayerIds = [
      'Open Businesses',
      'Crime Cases',
      'Subway Entrances',
      'Street Lights Reports',
      'Clear Data'
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
      if (id === 'Clear Data') {
        link.onclick = e => {
          e.preventDefault()
          e.stopPropagation()
          this.clearMap()
        }
      } else {
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
      }

      const layers = document.getElementById('menu')
      layers.appendChild(link)
    }

    ///// For testing purposes /////
    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(6),
        lat: map.getCenter().lat.toFixed(6),
        zoom: map.getZoom().toFixed(2)
      })
    })
  }

  clearMap() {
    const sources = ['crimes', 'yelp', 'subwayEntrances', 'lights']
    const map = this.state.map
    sources.forEach(source => {
      map.getSource(source).setData({
        type: 'FeatureCollection',
        features: []
      })
    })
    this.setState({
      crimeFeatures: [],
      businessFeatures: [],
      subwayFeatures: [],
      lightsFeatures: []
    })
  }

  render() {
    return (
      <div>
        <div id="menu" />
        <Slider />
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
      </div>
    )
  }
}

const mapState = state => {
  return {
    businesses: state.businesses,
    crimes: state.crimes,
    subwayEntrances: state.subwayEntrances,
    lights: state.lights
  }
}

const mapDispatch = dispatch => {
  return {
    loadLights: coords => dispatch(fetchLightsFromApi(coords)),
    loadEntrances: coors => dispatch(fetchEntrancesFromApi(coors)),
    loadAllCrimes: coords => dispatch(fetchCrimesFromApi(coords)),
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(MapBox)
