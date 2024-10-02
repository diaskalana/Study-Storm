import { Container } from "react-bootstrap";
import { AccountInfo } from "../../components/user/account/accountInfo";
import AccountDetailsForm from "../../components/user/account/userDetails";
import Grid from "@mui/material/Grid";
import BreadCrumbs from "../../components/breadcrubs";

export default function UserProfilePage() {
  return (
    <Container style={{width:'100%', padding:'20px', display:'flex', flexDirection:'column'}}>
      <BreadCrumbs />
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <AccountInfo />
        </Grid>
        <Grid item md={9} xs={12}>
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Container>
  );
}
