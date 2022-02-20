import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZS1wZXRyb3YiLCJhIjoiY2t6dWZjM2I5NHVpMTJ2bnlkMnpieW5hcCJ9.ZSXwDnPqVR4UQVo-h7YtfQ';

const Map = ({ onPopup, lands }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mike-petrov/ckzufxdbc00tp14l8lri1wm3o',
      center: [31.6, 23],
      zoom: 9,
      maxBounds:[[30,22], [32,24]],
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const mapLands = [];
    for (let i = 0; i < lands.length; i++) {
      mapLands.push({
        'type': 'Feature',
        'properties': {
          ...lands[i],
        },
        'geometry': {
          'type': 'Polygon',
          'coordinates': lands[i].coordinates,
        }
      });
    }

    map.on('load', () => {
      map.addSource('areas', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': mapLands
        }
      });

      map.addLayer({
        'id': 'areas',
        'type': 'fill',
        'source': 'areas',
        'layout': {},
        'paint': {
          'fill-color': {
            'type': 'identity',
            'property': 'color'
          },
          'fill-opacity': 0.3
        }
      });

      map.on('click', 'areas', (e) => {
        onPopup('attack', e.features[0].properties);
      });

      map.on('mouseenter', 'areas', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'areas', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [lands]);

  return (
    <div className="container container_map">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;