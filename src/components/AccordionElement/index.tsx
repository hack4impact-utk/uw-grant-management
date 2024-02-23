'use client';
import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';
import { ProjectDocument as ProjectType } from '@/server/models/Project';

type AccordionElementProps = {
  organizationInfo: OrganizationType[];
};

function AccordionElement({ organizationInfo = [] }: AccordionElementProps) {
  const [projectsData, setProjectsData] = useState<
    Record<string, ProjectType[]>
  >({});

  // Fetch projects for a given organization ID
  const fetchProjects = async (organizationId: string) => {
    // Skip fetch if data already exists
    if (projectsData[organizationId]) {
      return;
    }

    // Fetch and update state
    try {
      const response = await fetch(
        `/api/projects?organizationId=${organizationId}`
      );
      const data = await response.json();
      setProjectsData((prevData) => ({ ...prevData, [organizationId]: data }));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div>
      {organizationInfo.map((org, i) => (
        <Accordion key={i} onChange={() => fetchProjects(org.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{org.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Projects</Typography>
            {/* Nested accordion for projects */}
            {projectsData[org.id] &&
              projectsData[org.id].map((project, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{project.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>x number of clients served</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default AccordionElement;
