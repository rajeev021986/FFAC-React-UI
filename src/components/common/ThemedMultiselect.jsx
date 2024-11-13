import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(options, values, theme) {
  return {
    fontWeight:
        values.indexOf(options) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ThemedMultiselect({
    sx,
    preValue,
    onChange,
    formik,
    label,
    id,
    helperText,
    options,
    error,
    ...props
}) {
  const theme = useTheme();
  const [allSelected, setAllSelected] = React.useState(preValue || []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAllSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    formik.setFieldValue(id,typeof value === 'string' ? value.split(',') : value);
  };

  return (
      <FormControl sx={{width: '100%'}}>
        <InputLabel id={`${id}-simple-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-simple-select-label`}
          id={id}
          multiple
          value={allSelected}
          onChange={handleChange}
          input={<OutlinedInput id={id+"select-multiple-chip"} label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              style={getStyles(option, allSelected, theme)}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}