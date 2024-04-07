'use client';
import React, { useEffect, useState } from 'react';
import { FilterPanelAutocomplete } from '@/components/FilterPanel/FilterPanelAutocomplete';

interface OrganizationRow {
  id: string;
  name: string;
}

interface ProjectRow {
  id: string;
  name: string;
  organizationId: string;
}

const AnalyticsPage = () => {
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectRow[]>([]);

  // State to keep track of selected filters
  const [selectedFilters, setSelectedFilters] = useState<{
    organizations: string[];
    projects: string[];
  }>({
    organizations: [],
    projects: [],
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
      const selectedOrgIds = value.map((item) => item.value);

      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        organizations: selectedOrgIds,
      }));

      if (selectedOrgIds.length > 0) {
        setSelectedFilters((prevFilters) => ({
          organizations: selectedOrgIds,
          projects: prevFilters.projects.filter((projectId) =>
            projects.some(
              (project) =>
                project.id === projectId &&
                selectedOrgIds.includes(project.organizationId)
            )
          ),
        }));
      } else {
        setSelectedFilters((prevFilters) => ({
          ...prevFilters,
          organizations: [],
          projects: prevFilters.projects,
        }));
      }
    } else if (name === 'projects') {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        projects: value.map((item) => item.value),
      }));
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
      : organizations.filter((org) =>
          selectedFilters.organizations.length > 0
            ? selectedFilters.organizations.includes(org.id)
            : true
        );

  const filteredProjects = projects.filter((project) =>
    selectedFilters.projects.length > 0
      ? selectedFilters.projects.includes(project.id)
      : true
  );

  return (
    <div>
      <FilterPanelAutocomplete
        name="organizations"
        label="Select Organizations"
        value={selectedFilters.organizations.map((id) => ({
          label: organizations.find((org) => org.id === id)?.name || '',
          value: id,
        }))}
        handleAutocompleteChange={(event, value) =>
          handleAutocompleteChange('organizations', value)
        }
        options={organizations.map((org) => ({
          label: org.name,
          value: org.id,
        }))}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />

      <FilterPanelAutocomplete
        name="projects"
        label="Select Projects"
        value={selectedFilters.projects.map((id) => ({
          label: projectOptions.find((proj) => proj.id === id)?.name || '',
          value: id,
        }))}
        handleAutocompleteChange={(event, value) =>
          handleAutocompleteChange('projects', value)
        }
        options={projectOptions.map((proj) => ({
          label: proj.name,
          value: proj.id,
        }))}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />

      <div>
        {displayedOrganizations.map((org) => (
          <div key={org.id}>
            <h2>{org.name}</h2>
            <ul>
              {filteredProjects
                .filter((project) => project.organizationId === org.id)
                .map((project) => (
                  <li key={project.id}>{project.name}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
