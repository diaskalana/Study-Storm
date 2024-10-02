import { Card, CardContent, Typography, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCard = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Notifications
        </Typography>
        <Typography variant="body2" color="textSecondary">
          You have 3 new notifications.
        </Typography>
      </CardContent>
      <IconButton>
        <NotificationsIcon />
      </IconButton>
    </Card>
  );
}

export default NotificationCard;
