'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import OrganizationAccordion from '@/components/OrganizationAccordion';
import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';
import LoadingBox from '@/components/LoadingBox';
import InputAdornment from '@mui/material/InputAdornment';
import { Search } from '@mui/icons-material';
import { TextField, Box, Container } from '@mui/material';
import debounce from 'lodash.debounce';

function OrganizationsPage() {
  // State variables
  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Indicates data loading state
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch organizations from the API
  const fetchOrganizations = async (searchTerm: string) => {
    try {
      const response = await fetch(`/api/organizations?search=${searchTerm}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Handle errors appropriately for the UI
    }
  };

  // Debounced function to limit API calls
  // Improves search responsiveness by limiting the frequency of API requests while the user is typing
  const debouncedFetchOrganizations = debounce(async (searchTerm: string) => {
    const results = await fetchOrganizations(searchTerm);
    setIsLoading(false);
    setOrganizations(results);
  }, 500); // This specifies the debounce time, I have it set to 1000ms for better visual testing

  // Memoized version of the debounced request
  // Without useCallback, the debounced function gets recreated on every component render leading to an API call with every keystroke, albeit delayed by the specified time
  // useCallback memoizes the debounced function, ensuring it's created only once, preserving the debouncing behavior
  const memoizedDebouncedFetchOrganizations = useCallback(
    (searchTerm: string) => debouncedFetchOrganizations(searchTerm),
    []
  );

  // Handles changes to the search input field
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsLoading(true);
    memoizedDebouncedFetchOrganizations(e.target.value);
  };

  // Initial Data Fetch on Mount
  useEffect(() => {
    debouncedFetchOrganizations('');
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '95vw',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        paddingTop: '.1rem',
        paddingBottom: '1rem',
        height: 'fit-content',
        marginTop: '1rem',
      }}
    >
      <Box
        sx={{
          marginTop: '24px',
        }}
      >
        <TextField
          placeholder="Search"
          fullWidth
          value={searchTerm}
          variant="standard"
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'hsl(0, 0%, 95.2%)',
              height: '3rem',
              padding: '1rem',
            },
            '& .MuiInputLabel-root': {
              color: 'text.secondary',
            },
          }}
        />
      </Box>
      <Box
        sx={{
          height: '80vh',
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: 'hsl(0, 0%, 90.2%)',
          // border: '1px solid gray',
        }}
      >
        {isLoading ? (
          <LoadingBox />
        ) : (
          organizations.map((org) => (
            <OrganizationAccordion key={org.id} organization={org} />
          ))
        )}
      </Box>
    </Container>
  );
}

export default OrganizationsPage;
