import React from 'react'
import {fetchCrimesFromApi} from '../store/crimes'
import {connect} from 'react-redux'
// import {Link} from 'react-router-dom'
// import {
//   Map,
//   MapContainer,
//   TileLayer,
//   Popup,
//   Circle,
//   LayersControl,
// } from 'react-leaflet'

export let allCrimes

class CrimesMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.loadAllCrimes()
  }

  render() {
    if (this.props.crimes.length > 0) {
      allCrimes = this.props.crimes[0].map(crime => (
        <div
          key={crime.arrest_key}
          center={[crime.latitude, crime.longitude]}
          radius={18}
          latitude={crime.latitude}
          longitude={crime.longitude}
          // stroke={false}
          // fill={true}
          // fillColor="#ff0000"
          // fillOpacity={0.8}
        >
          {crime.ofns_desc}
        </div>
      ))
    }
    return (
      <div>
        {/* <Map center={[40.708173, -73.996129]} zoom={12} scrollWheelZoom={false}>
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://api.mapbox.com/styles/v1/kamalt/ckkoarmdr0uxx17qq5qysvnnl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay checked name="Crime cases">
            {allCrimes}
            </LayersControl.Overlay>
          </LayersControl>
        </Map> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapState = state => {
  return {
    crimes: state.crimes
  }
}

const mapDispatch = dispatch => {
  return {
    loadAllCrimes: () => dispatch(fetchCrimesFromApi())
  }
}

const AllCrimesConnected = connect(mapState, mapDispatch)(CrimesMap)
export default AllCrimesConnected
