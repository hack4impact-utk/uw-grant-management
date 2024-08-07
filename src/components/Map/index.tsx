'use client';
import React, { useRef, useEffect, useState } from 'react';
import '../../assets/css/map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Drawer } from '../Drawer';
import Box from '@mui/material/Box';
import L, { LatLngTuple, StyleFunction, LeafletMouseEvent } from 'leaflet';
import { geoJSONData } from '../../utils/constants/geoData';
import { NumberValue, scaleQuantile } from 'd3-scale';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LoadingBox from '../LoadingBox';
import { Organization } from '@/utils/types/models';
import OrganizationAccordion from '../OrganizationAccordion';
import Typography from '@mui/material/Typography';

interface MapProps {
  searchObject: Record<string, any>;
}

interface ZipCodeInfo {
  clientsServed: number;
  totalOrganizationsPresent: number;
  totalProjectsPresent: number;
  organizationsPresent: Set<string>;
  projectsPresent: Set<string>;
}

// Defining the Map component
export default function Map({ searchObject }: MapProps) {
  const knoxvillePosition: LatLngTuple = [35.9606, -83.9207];
  const mapRef = useRef<L.Map | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedZipCode, setSelectedZipCode] = React.useState('');
  const [zipCodeData, setZipCodedata] = useState<Record<string, ZipCodeInfo>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [drawerIsLoading, setDrawerIsLoading] = useState(false);
  const [hoveredZipCode, setHoveredZipCode] = useState<string | null>(null);
  const [selectedZipCodeOrganizations, setSelectedZipCodeOrganizations] =
    useState<Organization[]>([]);
  const getZipCodeData = async () => {
    setIsLoading(true);
    fetch(`/api/zipcodes/?${new URLSearchParams(searchObject).toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          setIsLoading(false);
          return;
        }
        const data = await response.json();
        setZipCodedata(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(`Error fetching zip codes: ${err}`);
        setIsLoading(false);
      });
  };

  const getSelectedZipCodeOrganizations = async () => {
    const response = await fetch('/api/organizations/' + selectedZipCode);
    const data = await response.json();
    setSelectedZipCodeOrganizations(data.data);
    setDrawerIsLoading(false);
  };

  useEffect(() => {
    getZipCodeData();
  }, [searchObject]);

  useEffect(() => {
    if (drawerOpen) {
      setDrawerIsLoading(true);
      getSelectedZipCodeOrganizations();
    }
  }, [drawerOpen]);

  const clientsServedArray = Object.values(zipCodeData).map((zipCodeInfo) =>
    Number(zipCodeInfo.clientsServed)
  );

  const quantileScale = scaleQuantile()
    .domain(clientsServedArray)
    .range([0, 1, 2, 3, 4, 5]);

  const colors = [
    'rgba(255, 0, 0, 0.9)',
    'rgba(245, 80, 0, 0.8)',
    'rgba(235, 162, 0, 0.8)',
    'rgba(208, 224, 0, 0.8)',
    'rgba(150, 222, 57, 0.8)',
    'rgba(35, 222, 67, 0.9)',
  ];

  const getColor = (clientsServed: NumberValue) => {
    const index = quantileScale(clientsServed);
    return colors[index];
  };

  const getStyle: StyleFunction<any> = (feature) => {
    const zipCode = feature?.properties.ZCTA5CE10;
    const clientServed = zipCodeData[zipCode]?.clientsServed || 0;
    const fillColor = getColor(clientServed);

    return {
      fillColor,
      color: '#444',
      weight: 2,
      fillOpacity: zipCode == hoveredZipCode ? 1 : 0.5,
    };
  };

  const handleLayerMouseover = (e: LeafletMouseEvent) => {
    const zipCode = (e.target as any).feature.properties?.ZCTA5CE10 as string;
    setHoveredZipCode(zipCode);
  };

  const handleLayerMouseout = () => {
    setHoveredZipCode(null);
  };

  const handleLayerClick = (e: LeafletMouseEvent) => {
    const zipCode = (e.target as any).feature.properties?.ZCTA5CE10 as string;
    setSelectedZipCode(zipCode);
    setDrawerOpen(true);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <div style={{ height: '100%' }}>
          <MapContainer
            center={knoxvillePosition}
            zoom={10}
            style={{ height: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={geoJSONData}
              style={getStyle}
              onEachFeature={(feature, layer) => {
                layer.on({
                  mouseover: (e: LeafletMouseEvent) => handleLayerMouseover(e),
                  mouseout: handleLayerMouseout,
                  click: handleLayerClick,
                });
              }}
            />
          </MapContainer>
          {hoveredZipCode && (
            <Card
              style={{ position: 'absolute', top: 84, right: 20, zIndex: 400 }}
            >
              <CardContent>
                <h2>Zip Code: {hoveredZipCode}</h2>
                <br />
                <p>
                  Total Clients Served:{' '}
                  {zipCodeData[hoveredZipCode]?.clientsServed || 0}
                </p>
                <p>
                  Total Organizations:{' '}
                  {zipCodeData[hoveredZipCode]?.totalOrganizationsPresent || 0}
                </p>
                <p>
                  Total Projects:{' '}
                  {zipCodeData[hoveredZipCode]?.totalProjectsPresent || 0}
                </p>
              </CardContent>
            </Card>
          )}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              '.MuiDrawer-paper': {
                width: {
                  xs: '90vw',
                  sm: '80vw',
                  md: '50vw',
                  lg: '40vw',
                },
              },
            }}
          >
            <Box
              sx={{
                marginTop: '2rem',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  paddingBottom: '.5rem',
                  marginBottom: '.5rem',
                  borderBottom: '2px solid lightgray',
                }}
              >
                Organizations present in {selectedZipCode}
              </Typography>

              {drawerIsLoading ? (
                <LoadingBox />
              ) : (
                <Box
                  sx={{
                    height: 'fit-content',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    backgroundColor: 'lightgray',
                    borderRadius: '.5rem 0 0 .5rem',
                  }}
                >
                  {selectedZipCodeOrganizations.map((org) => (
                    <OrganizationAccordion key={org.id} organization={org} />
                  ))}
                </Box>
              )}
            </Box>
          </Drawer>
        </div>
      )}
    </div>
  );
}
