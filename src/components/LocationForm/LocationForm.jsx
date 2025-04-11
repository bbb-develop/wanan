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

// Validation function for coordinates
const validateCoordinates = (lat, lon) => {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  // Check if values are valid numbers
  if (isNaN(latNum) || isNaN(lonNum)) {
    return 'Invalid coordinates: Please enter numeric values.';
  }

  // Check latitude range (-90 to 90)
  if (latNum < -90 || latNum > 90) {
    return 'Invalid latitude: Must be between -90 and 90.';
  }

  // Check longitude range (-180 to 180)
  if (lonNum < -180 || lonNum > 180) {
    return 'Invalid longitude: Must be between -180 and 180.';
  }

  return ''; // No errors
};

const locationOptions = [
  { label: '大巨蛋', value: { lat: 25.042621362735623, lon: 121.55992502167489 } },
  { label: '行天宮', value: { lat: 25.062967889746403, lon: 121.53387135585557 } },
  { label: '藝文特區', value: { lat: 25.0174559440566, lon: 121.29944826179351 } },
  { label: 'Fang - 曾俊睿小兒科診所', value: { lat: 24.97527985738381, lon: 121.54603710858564 } },
  { label: 'Fang - 陳炯輝小兒科診所', value: { lat: 25.058086586093694, lon: 121.53128670099771 } },
  { label: 'Fang - 裕隆城', value: { lat: 24.978073411183676, lon: 121.54682518519282 } },
  { label: 'Fang - 康和春秋大樓', value: { lat: 24.98248339678915, lon: 121.54292490459738 } },
  { label: 'Fang - 群鑫當鋪', value: { lat: 24.981968695024573, lon: 121.5438976373802 } },
  { label: 'Fang - 公館_十盛奶茶公館', value: { lat: 25.01373675631062, lon: 121.53394691720122 } },
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

  const handlePaste = (e) => {
    // Prevent default paste behavior
    e.preventDefault();

    // Get pasted text
    const pastedText = e.clipboardData.getData('text').trim();

    // Split by comma and remove whitespace
    const [pastedLat, pastedLon] = pastedText.split(',').map((coord) => coord.trim());

    // Validate coordinates
    const validationError = validateCoordinates(pastedLat, pastedLon);

    if (validationError) {
      setError(validationError);
      setLat('');
      setLon('');
      return;
    } 

    setLat(pastedLat);
    setLon(pastedLon);
  }

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
        onPaste={handlePaste}
      />
      <LocationInput
        type="number"
        placeholder="Longitude"
        value={lon}
        onChange={handleLonChange}
        onPaste={handlePaste}
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
