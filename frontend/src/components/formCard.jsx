import { Button, Card } from "@mui/material";

const FormCard = ({title, action, onClick, children}) => {
    return (
        <Card elevation={1} style={{height:'100%', padding:'20px', overflow:'auto'}}>
            <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', padding:'10px 0px', position:'sticky', top:-20, background:'white', zIndex:5}}>
                <h2 style={{margin:0}}>{action} {title}</h2>
                <Button variant="contained" color="info" onClick={onClick}>{action}</Button>
            </div>
            {children}
        </Card>
    );
}

export default FormCard;