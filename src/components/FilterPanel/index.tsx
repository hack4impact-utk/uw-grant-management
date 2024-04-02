'use client';
import { Drawer } from '../Drawer';
import React, { useEffect, useState } from 'react';
import {
  FilterPanelAutocomplete,
  AutocompleteOption,
} from './FilterPanelAutocomplete';

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
      <div>
        <FilterPanelAutocomplete
          name="organizations"
          label="Select organizations"
          value={selectedFilters.organizations}
          handleAutocompleteChange={handleAutoCompleteChange}
          options={organizationsOptions}
        />
      </div>
      <div>
        <FilterPanelAutocomplete
          name="metrics"
          label="Select metrics"
          value={selectedFilters.metrics}
          handleAutocompleteChange={handleAutoCompleteChange}
          options={metricsOptions}
        />
      </div>
    </Drawer>
  );
};

export default FilterPanel;
