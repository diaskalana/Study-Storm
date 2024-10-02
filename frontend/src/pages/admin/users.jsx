import { Button, Container, Typography } from "@mui/material";
import BasicTable from "../../components/admin/users/table";
import { useNavigate } from "react-router-dom";

export default function AllUsersPage(){

    const navigate = useNavigate();

    const handelBtnClick = () => {
        console.log("Add User Btn Clicked");
        navigate("/admin/users/create");

    }

    return (
        <Container sx={{mt:5}}>
            {/* <Typography variant="h4">All Users</Typography> */}

            {/* Add user btn */}
            <Button
                variant="contained"
                sx={{bgcolor: "#1976d2", color: "#fff", mb: 2}}
                onClick={handelBtnClick}
            >
                Add User
            </Button>
            <BasicTable/>

        </Container>
    )
}
