import React from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'

class MainMap extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div>
        <MapContainer
          center={[40.706849, -74.009246]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  }
}

export default MainMap
