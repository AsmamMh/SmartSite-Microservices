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
import { chantierService } from '../services/api';

interface Chantier {
  id: string;
  name: string;
  location: string;
  status: string;
  startDate: string;
  projectId: string;
}

const Chantiers: React.FC = () => {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    try {
      const response = await chantierService.getAll();
      setChantiers(response.data);
    } catch (error) {
      console.error('Error fetching chantiers:', error);
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
      <Typography variant="h4" mb={3}>Gestion des Chantiers</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>ID Projet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chantiers.map((chantier) => (
              <TableRow key={chantier.id}>
                <TableCell>{chantier.id}</TableCell>
                <TableCell>{chantier.name}</TableCell>
                <TableCell>{chantier.location}</TableCell>
                <TableCell>{chantier.status}</TableCell>
                <TableCell>{new Date(chantier.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{chantier.projectId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Chantiers;
