import { FunctionComponent, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  fill: '#d00',
  stroke: 'none'
};

const Pin = () => (
  <svg height={20} viewBox="0 0 24 24" style={pinStyle}>
    <path d={ICON} />
  </svg>
);

const DroppableMarkerMap: FunctionComponent<{latt: number, long: number, change(p: {latt: number, long: number}): void}> = ({ latt, long, change }) => {
  const [viewport, setViewport] = useState({
    latitude: latt,
    longitude: long,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });

  const setMarkerPos = (event: any) => {
    change({
      long: event.lngLat[0],
      latt: event.lngLat[1],
    });
  };

  useEffect(() => {
    setViewport({
      ...viewport,
      latitude: latt,
      longitude: long
    });
  }, [latt, long]);

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={setViewport}
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxApiAccessToken="pk.eyJ1IjoiaGVucml4b3VlbnoiLCJhIjoiY2twNXFvNHZ1MHg3OTJ4cjJhYXExbm90ZyJ9.2HsGTgEpmvP_G5XTUin_gw"
      height="20vw"
      width="100%"
      onClick={setMarkerPos}
    >
      <Marker
        latitude={latt}
        longitude={long}
        offsetTop={-20}
        offsetLeft={-10}
        draggable
        onDragEnd={setMarkerPos}
      >
        <Pin />
      </Marker>
    </ReactMapGL>
  )
};

export default DroppableMarkerMap;