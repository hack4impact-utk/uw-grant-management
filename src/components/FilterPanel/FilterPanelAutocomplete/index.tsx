import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip } from '@mui/material';

export interface AutocompleteOption {
  label: string;
  value: string;
}

interface FilterPanelAutocompleteProps {
  name: string;
  options: AutocompleteOption[];
  value: AutocompleteOption[];
  label: string;
  handleAutocompleteChange: (
    targetName: string,
    values: AutocompleteOption[]
  ) => void;
  isOptionEqualToValue?: (
    option: AutocompleteOption,
    value: AutocompleteOption
  ) => boolean;
}

export function FilterPanelAutocomplete({
  options,
  value,
  name,
  label,
  handleAutocompleteChange,
  isOptionEqualToValue,
}: FilterPanelAutocompleteProps) {
  return (
    <Autocomplete
      multiple
      value={value}
      onChange={(event, values) => handleAutocompleteChange(name, values)}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={isOptionEqualToValue}
      sx={{ width: 300, mt: 2 }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.label}>
            {option.label}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={index} label={option.label} />
        ));
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
