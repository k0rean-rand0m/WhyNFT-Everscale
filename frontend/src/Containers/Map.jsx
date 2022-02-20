import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZS1wZXRyb3YiLCJhIjoiY2t6dWZjM2I5NHVpMTJ2bnlkMnpieW5hcCJ9.ZSXwDnPqVR4UQVo-h7YtfQ';

const Map = ({ onPopup }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mike-petrov/ckzufxdbc00tp14l8lri1wm3o',
      center: [31, 23],
      zoom: 9,
      maxBounds:[[30,22], [32,24]],
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    map.on('load', () => {
      map.addSource('areas', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'properties': {
              'name': 'Bigrows',
              'color': '#168C4D',
              'className': 'stat_block_item_title_green'
            },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [31, 23],
                  [31.2, 23],
                  [31.2, 23.2],
                  [31, 23.2],
                ]
              ]
            }
          }, {
            'type': 'Feature',
            'properties': {
              'name': 'Flowberies',
              'color': '#FF0000',
              'className': 'stat_block_item_title_red'
            },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [31, 23],
                  [30.8, 23],
                  [30.8, 22.8],
                  [31, 22.8],
                ]
              ]
            }
          }, {
            'type': 'Feature',
            'properties': {
              'name': 'Lurkoban',
              'color': '#9D4C00',
              'className': 'stat_block_item_title_brown'
            },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [31, 23],
                  [30.8, 23],
                  [30.8, 23.2],
                  [31, 23.2],
                ]
              ]
            }
          }, {
            'type': 'Feature',
            'properties': {
              'name': 'Olya',
              'color': '#45ebaf',
              'className': ''
            },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [31, 23],
                  [31, 22.8],
                  [31.2, 22.8],
                  [31.2, 23],
                ]
              ]
            }
          }]
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
        if (e.features[0].properties.name === 'Olya') {
          onPopup('my');
        } else {
          onPopup('attack', e.features[0].properties);
        }
      });

      map.on('mouseenter', 'areas', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'areas', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [onPopup]);

  return (
    <div className="container container_map">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;