import {MapLayer} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import {withLeaflet} from 'react-leaflet'

class Routing extends MapLayer {
  createLeafletElement() {
    const {map} = this.props
    let leafletElement = L.Routing.control({
      waypoints: [L.latLng(40.7835, -73.9749), L.latLng(40.7831, -73.9721)]
    }).addTo(map.leafletElement)
    return leafletElement.getPlan()
  }
}
export default withLeaflet(Routing)
