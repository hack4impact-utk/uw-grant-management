import React, { useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Report, Project, Organization } from '@/utils/types/models';
import theme from '@/utils/constants/themes';
import Button from '@mui/material/Button';

function OrganizationAccordion({
  organization,
}: {
  organization: Organization;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
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
        backgroundColor: theme.primaryGrayHsl(85),
        width: '100%',
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
        sx={{
          borderRadius: '2px',
          border: `1px solid ${theme.whiteRGBA(40)}`,
          color: 'white',
          backgroundColor: theme.primaryBlue,
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            maxWidth: 'calc(100% - 10rem)',
            overflowY: 'auto',
          }}
        >
          <strong>{organization.name}</strong>{' '}
        </Typography>
        <Button
          href={`/analytics?organizationId=${organization.id}`}
          variant="contained"
          size="small"
          disableElevation
          sx={{
            position: 'absolute',
            right: 50,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: theme.primaryGrayHsl(50),
          }}
        >
          View Analytics
        </Button>
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

function ProjectAccordion({ project }: { project: Project }) {
  const [clientsServed, setClientsServed] = useState<Report[]>([]);
  const [isOpen, setOpen] = useState(false);
  const clientsServedCached = useRef<boolean>(false);

  const fetchClientsServed = async () => {
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
        margin: '.5rem',
      }}
    >
      <AccordionSummary
        expandIcon={isOpen ? <RemoveIcon /> : <AddIcon />}
        onClick={fetchClientsServed}
        style={{
          borderRadius: `4px 4px ${isOpen ? '0px 0px ' : '4px 4px'}`,
          transition: 'border-radius 300ms',
          color: theme.whiteRGBA(90),
          backgroundColor: theme.primaryBlueRGBA(90),
        }}
      >
        <Typography
          sx={{
            maxWidth: 'calc(100% - 10rem)',
          }}
        >
          <strong>{project.name}</strong>
        </Typography>
        <Button
          href={`/analytics?organizationId=${project.organizationId}&projectId=${project.id}`}
          variant="contained"
          size="small"
          disableElevation
          sx={{
            position: 'absolute',
            right: 50,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: theme.primaryGrayHsl(50),
          }}
        >
          View Analytics
        </Button>
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
