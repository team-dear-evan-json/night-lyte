import React from 'react'
import {MapContainer, TileLayer, Marker, Popup, Circle} from 'react-leaflet'
import {businesses} from '../../dummyData/businesses'
import L from 'leaflet'
//import ReactLeafletSearch from 'react-leaflet-search'
const icon = `./images/marker_orb_1x.svg`

const businessIcon = new L.Icon({
  iconUrl: icon,
  iconRetinaUrl: icon,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [25, 55],
  className: 'leaflet-div-icon'
})

const icon2 = new L.circleMarker()

class MainMapDummy extends React.Component {
  constructor() {
    super()
    this.state = {hour: 21}
  }
  render() {
    return (
      <div>
        <Map center={[40.716444, -73.998156]} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            url="https://api.mapbox.com/styles/v1/kamalt/ckkoarmdr0uxx17qq5qysvnnl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
            border="0px"
          />
          {/* <ReactLeafletSearch position="topleft" /> */}
          {businesses.map(business => {
            return (
              <Circle
                center={business.location}
                radius={18}
                stroke={false}
                // color="#E9C37B"
                fill={true}
                fillColor="#E9C37B"
                fillOpacity={0.8}
              >
                <Popup>{business.name}</Popup>
              </Circle>
            )
          })}
        </Map>
      </div>
    )
  }
}

export default MainMapDummy

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

//Manipulate the route object returned from directions
// map.on('load', function () {
//   directions.on('route', function (ev) {
// console.log(ev.route)
// console.log(ev)
// var styleSpec = ev.route;
// var styleSpecBox = document.getElementById('json-response');
// var styleSpecText = JSON.stringify(styleSpec, null, 2);
// var syntaxStyleSpecText = syntaxHighlight(styleSpecText);
// styleSpecBox.innerHTML = syntaxStyleSpecText;
//   })
// })
