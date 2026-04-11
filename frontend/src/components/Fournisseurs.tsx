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
import { fournisseursService } from '../services/api';

interface Fournisseur {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  speciality: string;
}

const Fournisseurs: React.FC = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await fournisseursService.getAll();
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Error fetching fournisseurs:', error);
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
      <Typography variant="h4" mb={3}>Gestion des Fournisseurs</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Spécialité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fournisseurs.map((fournisseur) => (
              <TableRow key={fournisseur.id}>
                <TableCell>{fournisseur.id}</TableCell>
                <TableCell>{fournisseur.name}</TableCell>
                <TableCell>{fournisseur.email}</TableCell>
                <TableCell>{fournisseur.phone}</TableCell>
                <TableCell>{fournisseur.address}</TableCell>
                <TableCell>{fournisseur.speciality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Fournisseurs;
