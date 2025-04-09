import React, { useState } from 'react';
import styled from 'styled-components';
import { useApplicationContext } from '../../providers/applicationProvider';
import { usePutLocation } from '../../api/putLocation';

const LocationFormContainer = styled.div`
  margin-bottom: 12px;
  padding: 12px;
`;

const LocationInput = styled.input`
  width: 100%;
  margin-right: 12px;
  border: 1px solid #999;
  border-radius: 6px;
  padding: 3px 6px;
  margin-bottom: 12px;
`;

const LocationButton = styled.button`
  border: 1px solid #999;
  padding: 6px;
  border-radius: 6px;
  margin-right: 6px;
`;

const LocationSelect = styled.select`
  margin-bottom: 12px;
  border: 1px solid #999;
  border-radius: 6px;
  padding: 6px;
`;




const locationOptions = [
  { label: '大巨蛋', value: { lat: 25.042621362735623, lon: 121.55992502167489 } },
  { label: 'Fang - 曾俊睿小兒科診所', value: { lat: 24.97527985738381, lon: 121.54603710858564 } },
  { label: 'Fang - 康和春秋大樓', value: { lat: 24.98248339678915, lon: 121.54292490459738 } },
  { label: 'Fang - 群鑫當鋪', value: { lat: 24.981968695024573, lon: 121.5438976373802 } },
  { label: 'Fang_公館 - 十盛奶茶公館', value: { lat: 25.01373675631062, lon: 121.53394691720122 } },
];

const LocationForm = () => {
  const { token, deviceConfig } = useApplicationContext();
  const { putLocation } = usePutLocation();
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');



  const handleLocationChange = (event) => {
    const selectedLocation = locationOptions.find(option => option.label === event.target.value);
    if (selectedLocation) {
      setLat(selectedLocation.value.lat);
      setLon(selectedLocation.value.lon);
    }
  };

  const handleLatChange = (event) => {
    setLat(event.target.value);
    setError('');
  };

  const handleLonChange = (event) => {
    setLon(event.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      await putLocation({ token, lat, lon, deviceConfig });
    } catch (e) {
      setError('Failed to update location.', 'error:', e.message);
    }
  };

  return (
    <LocationFormContainer>
      <LocationInput
        type="number"
        placeholder="Latitude"
        value={lat}
        onChange={handleLatChange}
      />
      <LocationInput
        type="number"
        placeholder="Longitude"
        value={lon}
        onChange={handleLonChange}
      />
      <div style={{ height: '24px', color: 'red' }}>{error}</div>

      <LocationButton type="button" onClick={handleSubmit}>
        Update
      </LocationButton>
      <LocationButton type="button" onClick={() => { setLat(25.042621362735623); setLon(121.559925021674890); }}>
        Default
      </LocationButton>
      <LocationSelect onChange={handleLocationChange}>
        {locationOptions.map(option => (
          <option key={option.value.lat} value={option.label}>
            {option.label}
          </option>
        ))}
      </LocationSelect>
    </LocationFormContainer>
  );
};

export default LocationForm;
