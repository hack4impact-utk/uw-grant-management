'use client';
import { useEffect, useState } from 'react';
import OrganizationAccordion from '@/components/OrganizationAccordion';
import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';

function Nonprofits() {
  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/organizations');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setOrganizations(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      {organizations.map((org) => (
        <OrganizationAccordion key={org.id} organization={org} />
      ))}
    </div>
  );
}

export default Nonprofits;
