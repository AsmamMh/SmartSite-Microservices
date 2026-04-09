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
  CircularProgress,
} from '@mui/material';
import { planningService } from '../services/api';

interface Planning {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  chantierId: string;
  assignedTo: string;
}

const Planning: React.FC = () => {
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlannings();
  }, []);

  const fetchPlannings = async () => {
    try {
      const response = await planningService.getAll();
      setPlannings(response.data);
    } catch (error) {
      console.error('Error fetching plannings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>Gestion du Planning</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>ID Chantier</TableCell>
              <TableCell>Assigné à</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plannings.map((planning) => (
              <TableRow key={planning.id}>
                <TableCell>{planning.id}</TableCell>
                <TableCell>{planning.title}</TableCell>
                <TableCell>{planning.description}</TableCell>
                <TableCell>{new Date(planning.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(planning.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{planning.status}</TableCell>
                <TableCell>{planning.chantierId}</TableCell>
                <TableCell>{planning.assignedTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Planning;
