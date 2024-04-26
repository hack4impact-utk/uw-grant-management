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
import { theme } from '../../utils/constants/themes';

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
        borderRadius: '2px',
        color: 'black',
        backgroundColor: theme.primaryYellowRGBA(50),
      }}
    >
      <AccordionSummary
        expandIcon={
          isOpen ? (
            <RemoveIcon
              sx={{
                color: theme.whiteRGBA(50),
              }}
            />
          ) : (
            <AddIcon
              sx={{
                color: theme.whiteRGBA(50),
              }}
            />
          )
        }
        onClick={fetchProjects}
        style={{
          borderRadius: '2px',
          border: `1px solid ${theme.whiteRGBA(40)}`,
          color: 'white',
          backgroundColor: theme.primaryBlue,
        }}
      >
        <Typography>
          <strong>{organization.name}</strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{
            fontWeight: 'bold',
            borderBottom: `2px solid ${theme.primaryBlueRGBA(50)}`,
            color: theme.primaryBlue,
            width: '100%',
            padding: '4px',
            margin: '8px 0',
          }}
        >
          Organization Projects
        </Typography>
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
        color: 'black',
        backgroundColor: 'white',
        borderRadius: `4px`,
      }}
    >
      <AccordionSummary
        expandIcon={isOpen ? <RemoveIcon /> : <AddIcon />}
        onClick={fetchCleientsServed}
        style={{
          borderRadius: `4px 4px ${isOpen ? '0px 0px ' : '4px 4px'}`,
          transition: 'border-radius 300ms',
          color: theme.whiteRGBA(90),
          backgroundColor: theme.primaryBlueRGBA(85),
        }}
      >
        <Typography>
          <strong>{project.name}</strong>
        </Typography>
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
