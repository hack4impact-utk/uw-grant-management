import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Organization as OrganizationType } from '@/utils/types/models';

type AccordionElementProps = {
  organizationInfo: OrganizationType[];
};

function AccordionElement({ organizationInfo = [] }: AccordionElementProps) {
  return (
    <div>
      {organizationInfo.map((org, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{org.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Details about {org.name}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default AccordionElement;
