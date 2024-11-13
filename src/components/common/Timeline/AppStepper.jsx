import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { LocationOnOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Chip } from '@mui/material';

const Default = [
  { info: '09/09/2024', label: 'POL', name: 'Long Beach, CA' },
  { type: 'button', btn_text: 'Tracking', onClick: () => { console.log('clicked') } },
  { info: '09/09/2024', label: 'FPD', name: 'Long Beach, CA' },
];

export default function AppStepper({
  steps = Default,
  activeStep = 1,
  StepIconComponent = LocationOnOutlined
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {
          Array.isArray(steps) && steps.map((step, index) => (
            <Step key={index} sx={styles.step_label}>
              {step.type === 'button' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    label={step.btn_text}
                    clickable
                    color="primary"
                    onClick={step.onClick}
                    sx={{zIndex: 9}}
                    />
                </Box>
              ) : (
                <StepLabel StepIconComponent={StepIconComponent}>
                  <Box>
                    <Box sx={{ fontWeight: 'bold' }}>{step?.label}</Box>
                    <Box>{step?.name}</Box>
                    <Box>{step.info}</Box>
                  </Box>
                </StepLabel>
              )}
            </Step>
          ))
        }
      </Stepper>
    </Box>
  );
}

const styles = {
  step_label: {
    '& .MuiStepLabel-iconContainer.Mui-active': {
      color: 'primary.main',
    },
    '& .MuiStepLabel-iconContainer.Mui-completed': {
      color: 'primary.main',
    },
    '& .MuiStepLabel-iconContainer.Mui-disabled': {
      color: '#0000008a',
    },
  }
};
