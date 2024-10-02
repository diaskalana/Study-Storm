import { Autocomplete, TextField, Typography } from "@mui/material";

const CustomAutoComplete = ({options, label, multiple = false, errorMsg, isError, setError = () => {}, value, setValue}) => {
    return(
        <>
            <Autocomplete
                multiple={multiple}
                options={options}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" label={label} placeholder={label} fullWidth />}
                value={value}
                onChange={(e, newValue) => {
                    setValue(newValue)       
                    
                    if(!newValue) setError(true);
                    else setError(false);
                }}
            />
            <Typography variant="caption" display={isError ? 'block' : 'none'} color={"red"} gutterBottom>
                *{errorMsg}
            </Typography>
        </>
    );
}

export default CustomAutoComplete;