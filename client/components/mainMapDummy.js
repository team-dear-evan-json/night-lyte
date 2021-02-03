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
        <MapContainer
          center={[40.716444, -73.998156]}
          zoom={15}
          scrollWheelZoom={false}
        >
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
        </MapContainer>
      </div>
    )
  }
}

export default MainMapDummy
