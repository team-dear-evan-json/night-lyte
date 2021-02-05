import {MapLayer} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import {withLeaflet} from 'react-leaflet'

class Routing extends MapLayer {
  createLeafletElement() {
    const {map} = this.props
    let leafletElement = L.Routing.control({
      waypoints: [
        L.latLng(40.7269050978696, -74.00726690891673),
        L.latLng(40.71713112760758, -73.99850125392882)
      ]
    }).addTo(map.leafletElement)
    return leafletElement.getPlan()
  }
}
export default withLeaflet(Routing)
