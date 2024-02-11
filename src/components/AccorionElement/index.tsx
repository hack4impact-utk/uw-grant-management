import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

interface AccordionElementProps {
  sections: Section[];
}

interface Section {
  title: string;
  content: string;
  subsections?: Subsection[]; // Make subsections optional
}

interface Subsection {
  title: string;
  content: string;
}

const AccordionElement = ({ sections }: AccordionElementProps) => {
  return (
    <div>
      {/* Outer Accordion */}
      {sections.map((section, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{section.title}</Typography> {/* Outer Title */}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{section.content}</Typography> {/* Outer Text */}
            {/* Inner Accordion */}
            {section.subsections?.map((sub, j) => (
              <Accordion key={`${i}-${j}`}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{sub.title}</Typography> {/* Inner Title */}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{sub.content}</Typography> {/* Inner Text */}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AccordionElement;
