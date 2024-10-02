import { Box, LinearProgress, Typography } from "@mui/material";

function CustomProgresssBar({value = 0}) {
    console.log(value);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={value}/>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
}

export default CustomProgresssBar;