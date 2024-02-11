import Navbar from '@/components/Navbar';

import AccordionElement from '@/components/AccorionElement';

// Accordion Prop Example
const sectionsProp = [
  {
    title: 'Nonprofit 1',
    content: 'About Nonprofit 1',
    subsections: [
      {
        title: 'They did x',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      {
        title: 'They did y',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      {
        title: 'They did z',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      // Add more subsections if needed
    ],
  },
  {
    title: 'Nonprofit 2',
    content: 'About Nonprofit 2',
    subsections: [
      {
        title: 'They did x',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      {
        title: 'They did y',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      {
        title: 'They did z',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      },
      // Add more subsections if needed
    ],
  },
  // Add more sections if needed
];

function Nonprofits() {
  return (
    <div>
      <Navbar />
      <AccordionElement sections={sectionsProp} />
    </div>
  );
}

export default Nonprofits;
