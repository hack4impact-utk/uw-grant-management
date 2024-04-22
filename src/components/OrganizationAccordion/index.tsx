import React, { useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { OrganizationDocument as OrganizationType } from '@/server/models/Organization';
import { ProjectDocument as ProjectType } from '@/server/models/Project';
import { ReportDocument as ReportType } from '@/server/models/Report';

function OrganizationAccordion({
  organization,
}: {
  organization: OrganizationType;
}) {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isOpen, setOpen] = useState(false);
  const projectsCached = useRef<boolean>(false);

  const fetchProjects = async () => {
    if (isOpen) {
      setOpen(false);
      return;
    }

    if (!projectsCached.current) {
      const response = await fetch(
        `/api/projects?organizationId=${organization.id}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProjects(data);
      projectsCached.current = true;
    }

    setOpen(true);
  };

  return (
    <Accordion
      expanded={isOpen}
      style={{
        margin: '10px',
        borderRadius: '10px',
        color: 'black',
        backgroundColor: 'rgba(192, 210, 255, 0.8)',
      }}
    >
      <AccordionSummary
        expandIcon={isOpen ? <RemoveIcon /> : <AddIcon />}
        onClick={fetchProjects}
        style={{
          borderRadius: '10px',
          color: 'white',
          backgroundColor: 'rgba(50, 102, 218, 1)',
        }}
      >
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
  const [isOpen, setOpen] = useState(false);
  const clientsServedCached = useRef<boolean>(false);

  const fetchCleientsServed = async () => {
    if (isOpen) {
      setOpen(false);
      return;
    }

    if (!clientsServedCached.current) {
      const response = await fetch(
        `/api/reports?fields=clientsServed&projectId=${project.id}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setClientsServed(data);
      clientsServedCached.current = true;
    }
    setOpen(true);
  };

  return (
    <Accordion
      expanded={isOpen}
      style={{
        margin: '7px',
        borderRadius: '10px',
        color: 'black',
        backgroundColor: 'rgba(241, 244, 251, 1)',
      }}
    >
      <AccordionSummary
        expandIcon={isOpen ? <RemoveIcon /> : <AddIcon />}
        onClick={fetchCleientsServed}
        style={{
          borderRadius: '10px',
          color: 'black',
          backgroundColor: 'white',
        }}
      >
        <Typography>{project.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {clientsServed.length === 0 ? (
          <Typography>Number of clients served: No data</Typography>
        ) : (
          <Typography>
            Number of clients served: {clientsServed[0].clientsServed}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default OrganizationAccordion;
