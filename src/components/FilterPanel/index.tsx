import { Drawer } from '../Drawer';
import React, { useEffect, useState } from 'react';
import {
  FilterPanelAutocomplete,
  AutocompleteOption,
} from './FilterPanelAutocomplete';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  setSearchObject: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  searchObject: Record<string, any>;
}

interface OrganizationRow {
  id: string;
  name: string;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const ContainerDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const CustomTooltip = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'full',
});

const CustomTooltipContent = styled('p')({
  padding: '5px 10px',
  borderWidth: '2px',
  borderColor: '#000',
  borderRadius: '20px',
  backgroundColor: '#FFB351',
  width: 'fit-content',
  height: 'fit-content',
  textAlign: 'right',
  float: 'right',
  marginLeft: '10px',
  marginTop: '10px',
});

const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  setSearchObject,
  searchObject,
}) => {
  const camelCaseToTitleCase = (camelCase: string) => {
    if (camelCase === '') return camelCase;

    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  };

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Array<AutocompleteOption>>
  >({
    organizations: [],
    metrics: [],
  });

  const [metricsOptions, setMetricsOptions] = useState<AutocompleteOption[]>(
    []
  );

  const [organizationsOptions, setOrganizationsOptions] = useState<
    AutocompleteOption[]
  >([]);

  const getMetrics = async () => {
    const response = await fetch('/api/metrics/');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics data');
    }
    const data = await response.json();
    setMetricsOptions(
      data.metrics.map((key: string) => ({
        label: camelCaseToTitleCase(key),
        value: key,
      }))
    );
  };

  const getOrganizations = async () => {
    const response = await fetch('/api/organizations/');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics data');
    }
    const data = await response.json();
    setOrganizationsOptions(
      data.map((org: OrganizationRow) => {
        return {
          label: org.name,
          value: org.id,
        };
      })
    );
  };

  const handleAutoCompleteChange = (
    targetName: string,
    values: AutocompleteOption[]
  ) => {
    setSearchObject({
      ...searchObject,
      [targetName]: values.map((value) => value.value),
    });

    setSelectedFilters({
      ...selectedFilters,
      [targetName]: values,
    });
  };

  useEffect(() => {
    getMetrics();
    getOrganizations();
  }, []);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      style={{
        zIndex: 998,
      }}
    >
      <h2
        style={{
          padding: '12px',
        }}
      >
        Filters
      </h2>

      <ContainerDiv>
        <FilterPanelAutocomplete
          name="organizations"
          label="Select organizations"
          value={selectedFilters.organizations}
          handleAutocompleteChange={handleAutoCompleteChange}
          options={organizationsOptions}
        />
        <HtmlTooltip
          title={
            <>
              <Typography color="inherit">Select Organizations</Typography>
              <p>
                The map data and regional color gradient will be rendered using
                only the reports from the selected organizations.
              </p>
            </>
          }
        >
          <CustomTooltip>
            <CustomTooltipContent>?</CustomTooltipContent>
          </CustomTooltip>
        </HtmlTooltip>
      </ContainerDiv>

      <ContainerDiv>
        <FilterPanelAutocomplete
          name="metrics"
          label="Select metrics"
          value={selectedFilters.metrics}
          handleAutocompleteChange={handleAutoCompleteChange}
          options={metricsOptions}
        />
        <HtmlTooltip
          title={
            <>
              <Typography color="inherit">Select Metrics</Typography>
              <p>
                The map data and regional color gradient will be rendered using
                only the reports that have a non-zero value for at least one of
                the selected metrics.
              </p>
            </>
          }
        >
          <CustomTooltip>
            <CustomTooltipContent>?</CustomTooltipContent>
          </CustomTooltip>
        </HtmlTooltip>
      </ContainerDiv>
    </Drawer>
  );
};

export default FilterPanel;
