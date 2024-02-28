'use client';
import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';
import { ProjectDocument as ProjectType } from '@/server/models/Project';
import { ReportDocument as ReportType } from '@/server/models/Report';

type AccordionElementProps = {
  organizationInfo: OrganizationType[];
};

function AccordionElement({ organizationInfo = [] }: AccordionElementProps) {
  return (
    <div>
      {organizationInfo.map((org) => (
        <OrganizationAccordion key={org.id} organization={org} />
      ))}
    </div>
  );
}

function OrganizationAccordion({
  organization,
}: {
  organization: OrganizationType;
}) {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `/api/projects?organizationId=${organization.id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [organization.id]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{organization.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Projects:</Typography>
        {projects.map((project, index) => (
          <ProjectAccordion key={index} project={project} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

function ProjectAccordion({ project }: { project: ProjectType }) {
  const [clientsServed, setClientsServed] = useState<ReportType[]>([]);

  useEffect(() => {
    const fetchClientsServed = async () => {
      try {
        const response = await fetch(
          `/api/reports?fields=clientsServed&projectId=${project.id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClientsServed(data);
      } catch (error) {
        console.error('Error fetching clients served:', error);
      }
    };

    fetchClientsServed();
  }, [project.id]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{project.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {clientsServed[0] ? (
          <Typography>
            Number of clients served: {clientsServed[0].clientsServed}
          </Typography>
        ) : (
          <Typography>Number of clients served: No data</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionElement;
