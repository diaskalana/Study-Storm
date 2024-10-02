import { Button, Grid, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Grid
      container
      sx={{
        marginTop: "20px",
        marginBottom: "20px",
        alignItems: "center",
        flexDirection: { xs: "column-reverse", sm: "row" }
      }}
      spacing={2}
    >
      {/* Content */}
      <Grid item xs={12} sm={6} md={6}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Don't just learn about AI. Learn how to use it
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          With the new Google AI Essentials course, you'll learn from AI experts
          at Google and build essential AI skills to boost productivity, zero
          experience required.
        </Typography>
        {/* Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <Button fullWidth variant="contained" color="primary">
              Learn more
            </Button>
          </Grid>
          <Grid item xs={6} md={4}>
            <Button fullWidth variant="outlined" color="primary">
              Get started
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* Image */}
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "center"
        }}
      >
        <img
          src="campus-girl.png"
          alt="placeholder"
          style={{ width: "100%", height: "auto" }}
        />
      </Grid>
    </Grid>
  );
};

export default Hero;
