'use client';
import { useEffect, useState } from 'react';
import OrganizationAccordion from '@/components/OrganizationAccordion';
import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';
import LoadingBox from '@/components/LoadingBox';

function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getOrganizations = async () => {
    const response = await fetch('/api/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    setOrganizations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <div style={{ height: '95vh', overflowY: 'auto' }}>
      {isLoading ? (
        <LoadingBox />
      ) : (
        organizations.map((org) => (
          <OrganizationAccordion key={org.id} organization={org} />
        ))
      )}
    </div>
  );
}

export default OrganizationsPage;
