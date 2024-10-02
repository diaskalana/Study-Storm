import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography } from '@mui/material';

// Custom date picker component
const CustomDatePicker = ({label = 'Date Picker', errorMsg, isError, setError, value, setValue, disablePast = false, disableFuture = false}) => {

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disablePast = {disablePast}
          disableFuture = {disableFuture}
          closeOnSelect
          sx={{width:'100%'}}
          label={label}
          value={value}
          slotProps={{ textField: { size: 'small' } }}
          onChange={(newValue) => {
            setValue(newValue)       
            
            if(!newValue) setError(true);
            else setError(false);
          }}
        />
      </LocalizationProvider>
      <Typography variant="caption" display={isError ? 'block' : 'none'} color={"red"} gutterBottom>
        *{errorMsg}
      </Typography>
    </>
  );
}

export default CustomDatePicker;