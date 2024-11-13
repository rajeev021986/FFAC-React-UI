import React from 'react';
import { Chip, Stack, Typography } from '@mui/material';


function FilterChipGroup({ title,category,type, options, selectedFilters, handleChipClick }) {

  return (
    <>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, my: 1 }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{maxHeight : '200px', overflowY : 'auto'}}>
        {options?.map((option) => (
          <Chip
            key={option.value}
            label={option.count ? `${option?.label} (${option.count})` : option.label}
            clickable
            color={selectedFilters.includes(option.value) ? 'primary' : 'default'}
            onClick={() => handleChipClick(option.value, category, type)}
          />
        ))}
      </Stack>
    </>
  );
}

export default FilterChipGroup;
