import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

export function AccountInfo() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data from local storage once when component mounts
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
  }, []);

  const handleUpload = () => {
    console.log(user);
    // Handle upload logic here
  };

  return( 
    <>
      {user && (
        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <div>
                <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
              </div>
              <Stack spacing={1} sx={{ textAlign: 'center' }}>
                <Typography color="textPrimary" gutterBottom variant="h4">
                  {user.firstName}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Button fullWidth variant="text" onClick={handleUpload}>
              Upload picture
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}
