import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { notificationService } from '../services/api';
import keycloak from '../auth/keycloak';

interface Notification {
  id: number;
  title: string;
  description: string;
  notificationType: string;
  read: boolean;
  receivedDate: string;
  receiver: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const currentUserId = (keycloak.tokenParsed as any)?.sub as string | undefined;
      const response = currentUserId
        ? await notificationService.getByReceiver(currentUserId)
        : await notificationService.getAll();
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // const getTypeColor = (type: string) => {
  //   switch (type.toLowerCase()) {
  //     case 'info':
  //       return 'info';
  //     case 'success':
  //       return 'success';
  //     case 'warning':
  //       return 'warning';
  //     case 'error':
  //       return 'error';
  //     default:
  //       return 'default';
  //   }
  // };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>Gestion des Notifications</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Message</TableCell>
           
              <TableCell>Statut</TableCell>
              <TableCell>Date de réception</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.id}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.description}</TableCell>
                
                <TableCell>
                  <Chip
                    label={notification.read ? 'Lue' : 'Non lue'}
                    color={notification.read ? 'default' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(notification.receivedDate).toLocaleDateString()}</TableCell>
                {/* <TableCell>{notification.receiver}</TableCell> */}
              </TableRow>
            ))} 
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Notifications;
