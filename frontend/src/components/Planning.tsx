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

interface PlanningProject {
  id: string | number;
  name: string;
  description: string;
  plannedStart?: string;
  plannedEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  estimateBudget?: number;
  actualBudget?: number;
  chantierId: string;
}

const Planning: React.FC = () => {
  const [plannings, setPlannings] = useState<PlanningProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlannings();
  }, []);

  const fetchPlannings = async () => {
    try {
      const response = await planningService.getAll();
      setPlannings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching plannings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return '-';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '-';
    }

    return parsed.toLocaleDateString();
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
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date planifiée début</TableCell>
              <TableCell>Date planifiée fin</TableCell>
              <TableCell>Date réelle début</TableCell>
              <TableCell>Date réelle fin</TableCell>
              <TableCell>Budget estimé</TableCell>
              <TableCell>Budget réel</TableCell>
              <TableCell>ID Chantier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plannings.map((planning) => (
              <TableRow key={planning.id}>
                <TableCell>{planning.id}</TableCell>
                <TableCell>{planning.name}</TableCell>
                <TableCell>{planning.description}</TableCell>
                <TableCell>{formatDate(planning.plannedStart)}</TableCell>
                <TableCell>{formatDate(planning.plannedEnd)}</TableCell>
                <TableCell>{formatDate(planning.actualStart)}</TableCell>
                <TableCell>{formatDate(planning.actualEnd)}</TableCell>
                <TableCell>{planning.estimateBudget ?? '-'}</TableCell>
                <TableCell>{planning.actualBudget ?? '-'}</TableCell>
                <TableCell>{planning.chantierId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Planning;
