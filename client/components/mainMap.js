import React from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import {businesses} from '../../dummyData/businesses'

class MainMap extends React.Component {
  // constructor() {
  //   super()
  //   this.state = {hour: 21}
  // }
  render() {
    return (
      <div>
        <MapContainer
          center={[40.708173, -73.996129]}
          zoom={14}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/kamalt/ckkkid04w2ub017npxtqfeckc/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
          />
          {businesses.map(business => {
            return (
              <Marker position={business.location}>
                <Popup>{business.name}</Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    )
  }
}

export default MainMap
