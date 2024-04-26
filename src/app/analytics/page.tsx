'use client';
import React, { useEffect, useState } from 'react';
import { FilterPanelAutocomplete } from '@/components/FilterPanel/FilterPanelAutocomplete';
import ReportComponent from '@/components/CategoryTable/';
import Grid from '@mui/material/Grid';

interface OrganizationRow {
  id: string;
  name: string;
}

interface ProjectRow {
  id: string;
  name: string;
  organizationId: string;
}

interface SelectedFilters {
  organizations: string[];
  allOrganizations: boolean;
  projects: string[];
  allProjects: boolean;
}

const AnalyticsPage = () => {
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectRow[]>([]);

  // State to keep track of selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    organizations: [],
    allOrganizations: true,
    projects: [],
    allProjects: true,
  });

  const getOrganizations = async () => {
    const response = await fetch('/api/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    setOrganizations(data);
  };

  const getProjects = async () => {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    getOrganizations();
    getProjects();
  }, []);

  // Update project options based on selected organizations
  useEffect(() => {
    if (selectedFilters.organizations.length > 0) {
      setProjectOptions(
        projects.filter((project) =>
          selectedFilters.organizations.includes(project.organizationId)
        )
      );
    } else {
      setProjectOptions(projects);
    }
  }, [selectedFilters.organizations, projects]);

  // Handles changes to filter options and clears unrelated projects when Organization is changed
  const handleAutocompleteChange = (name: string, value: any[]) => {
    if (name === 'organizations') {
      const isAllSelected = value.some((item) => item.value === 'all');
      if (isAllSelected && value.length === 1) {
        setSelectedFilters({
          organizations: [],
          allOrganizations: true,
          projects: [],
          allProjects: true,
        });
      } else {
        const selectedOrgIds = value
          .filter((item) => item.value !== 'all')
          .map((item) => item.value);
        setSelectedFilters((prev) => ({
          ...prev,
          allOrganizations: false,
          organizations: selectedOrgIds,
        }));
      }
    } else if (name === 'projects') {
      const isAllSelected = value.some((item) => item.value === 'all');
      if (isAllSelected && value.length === 1) {
        setSelectedFilters((prev) => ({
          ...prev,
          allProjects: true,
          projects: [],
        }));
      } else {
        const selectedProjectIds = value
          .filter((item) => item.value !== 'all')
          .map((item) => item.value);
        setSelectedFilters((prev) => ({
          ...prev,
          allProjects: false,
          projects: selectedProjectIds,
        }));
      }
    }
  };

  const displayedOrganizations =
    selectedFilters.projects.length > 0 &&
    selectedFilters.organizations.length === 0
      ? organizations.filter((org) =>
          projects.some(
            (proj) =>
              selectedFilters.projects.includes(proj.id) &&
              proj.organizationId === org.id
          )
        )
      : selectedFilters.organizations.length > 0
        ? organizations.filter((org) =>
            selectedFilters.organizations.includes(org.id)
          )
        : organizations;

  const filteredProjects =
    selectedFilters.projects.length === 0
      ? projects
      : projects.filter((project) =>
          selectedFilters.projects.includes(project.id)
        );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FilterPanelAutocomplete
          name="organizations"
          label="Select Organizations"
          value={
            selectedFilters.allOrganizations
              ? [{ label: 'All', value: 'all' }]
              : selectedFilters.organizations.map((id) => ({
                  label: organizations.find((org) => org.id === id)?.name || '',
                  value: id,
                }))
          }
          handleAutocompleteChange={(event, value) =>
            handleAutocompleteChange('organizations', value)
          }
          options={[
            { label: 'All', value: 'all' },
            ...organizations.map((org) => ({
              label: org.name,
              value: org.id,
            })),
          ]}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />

        <FilterPanelAutocomplete
          name="projects"
          label="Select Projects"
          value={
            selectedFilters.allProjects
              ? [{ label: 'All', value: 'all' }]
              : selectedFilters.projects.map((id) => ({
                  label:
                    projectOptions.find((proj) => proj.id === id)?.name || '',
                  value: id,
                }))
          }
          handleAutocompleteChange={(event, value) =>
            handleAutocompleteChange('projects', value)
          }
          options={[
            { label: 'All', value: 'all' },
            ...projectOptions.map((proj) => ({
              label: proj.name,
              value: proj.id,
            })),
          ]}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ReportComponent
          organizationId={selectedFilters.organizations}
          projectId={selectedFilters.projects}
        />
      </Grid>
      {displayedOrganizations.map((org) => (
        <Grid item xs={12} key={org.id}>
          <div>
            <h2>{org.name}</h2>
            <ul>
              {filteredProjects
                .filter((project) => project.organizationId === org.id)
                .map((project) => (
                  <li key={project.id}>{project.name}</li>
                ))}
            </ul>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsPage;
