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
    }
  }
  async componentDidMount() {
    ///// Map set up /////
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

    // Creates a directions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    })

    map.addControl(directions, 'top-right')

    ///// Setting map data layers /////
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

      //subway layer
      map.addSource('subwayEntrances', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
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

      ///// Set Up Popups /////
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      ///// Popups for yelp /////
      map.on('mouseenter', 'Open Businesses', function(e) {
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

      map.on('mouseleave', 'Open Businesses', function() {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })

      ///// Popups for crimes /////
      map.on('mouseenter', 'Crime Cases', function(e) {
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

      map.on('mouseleave', 'Crime Cases', function() {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })

      ///// Popups for Subway /////
      map.on('mouseenter', 'Subway Entrances', function(e) {
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

      map.on('mouseleave', 'Subway Entrances', function() {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })

    ///// Set up functionality after an area has been searched /////
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
            description: `Name: ${element.name},
            Address: ${element.location.address1}`
          }
        }
      })
      map
        .getSource('yelp')
        .setData({type: 'FeatureCollection', features: yelpGeoJson})

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
      map
        .getSource('crimes')
        .setData({type: 'FeatureCollection', features: crimesGeoJson})

      //set data to entrances layer
      const entranceCoordinates = `${geoCoors[1]}, ${geoCoors[0]}`
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
      map
        .getSource('subwayEntrances')
        .setData({type: 'FeatureCollection', features: entranceGeoJson})
    })

    ///// Layers Filter /////
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

    ///// For testing purposes /////
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
        {/* <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
            {this.state.zoom} | Address:
            {this.state.geoAddress}
          </div>
        </div> */}
      </div>
    )
  }
}

const mapState = state => {
  return {
    businesses: state.businesses,
    crimes: state.crimes,
    subwayEntrances: state.subwayEntrances
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
