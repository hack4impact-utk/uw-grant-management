'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AccordionElement from '@/components/AccorionElement';

function Nonprofits() {
  const [organizationSections, setOrganizationSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getOrgInfo');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setOrganizationSections(data);
      } catch (error) {
        console.error('Error fetching organization info:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <AccordionElement organizationInfo={organizationSections} />
    </div>
  );
}

export default Nonprofits;
