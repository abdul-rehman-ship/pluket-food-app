import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import * as turf from '@turf/turf';
import Cookies from 'js-cookie';
const Map = () => {
  const [map, setMap]:any = useState(null);
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkMjI2NTUiLCJhIjoiY2xuaGUyb2tiMGx2NDJxbWJvcHM1aXY3ZiJ9.fowjI05HFOsGb65Q85GaHw'; // Use your Mapbox access token from environment variables


  useEffect(() => {

    const initializeMap = () => {
      Cookies.set('lat', '7.8798056');
      Cookies.set('lng', '98.2931667');
      const centerCoordinates:any = [98.2931667,7.8798056];
      const serviceAreaRadius :any= 2000; // 2km in meters

      const map:any = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // Use a map style without a blue background
        center: centerCoordinates,
        zoom: 15,
      });

      let marker:any = null; // Initialize marker variable

      // Function to check if a point is within the service area
      const isWithinServiceArea = (lng:any, lat:any) => {
        const center = map.getCenter();
        const coordinates1 = [center.lng, center.lat];
        const coordinates2 = [lng, lat];
        const point1 = turf.point(coordinates1);
        const point2 = turf.point(coordinates2);
        const distance = turf.distance(point1, point2, { units: 'meters' });

        return distance <= serviceAreaRadius;
      };
      marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([centerCoordinates[0], centerCoordinates[1]])
      .addTo(map);

      // Event handler for map click to add or update a marker
      map.on('click', (e:any) => {
        const { lng, lat } = e.lngLat;
        Cookies.set('lat', lat);
        Cookies.set('lng', lng);

        // Check if the clicked location is within the service area
        if (isWithinServiceArea(lng, lat)) {
          // Remove the previous marker if it exists
          if (marker) {
            marker.remove();
          }

          // Create a new marker at the clicked position
          marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(map);

          // Event handler for the new marker's dragend event to update the marker's position
          
        } else {
          console.log('Clicked location is outside the service area.');
        }
      });

      map.on('load', () => {
        map.addSource('service-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: centerCoordinates,
            },
          },
        });

        map.addLayer({
          id: 'service-area',
          type: 'circle',
          source: 'service-area',
          paint: {
            'circle-radius': serviceAreaRadius,
            
            'circle-opacity': 0.3,
          },
        });
      });

      setMap(map);
    };

    if (!map) {
      initializeMap();
    }

    // Clean up when the component unmounts
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '350px' }}></div>;
};

export default Map;
