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
import { materiauService } from '../services/api';

interface Materiau {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  supplierId: string;
}

const Materiaux: React.FC = () => {
  const [materiaux, setMateriaux] = useState<Materiau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMateriaux();
  }, []);

  const fetchMateriaux = async () => {
    try {
      const response = await materiauService.getAll();
      setMateriaux(response.data);
    } catch (error) {
      console.error('Error fetching materiaux:', error);
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
      <Typography variant="h4" mb={3}>Gestion des Matériaux</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>ID Fournisseur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiaux.map((materiau) => (
              <TableRow key={materiau.id}>
                <TableCell>{materiau.id}</TableCell>
                <TableCell>{materiau.name}</TableCell>
                <TableCell>{materiau.type}</TableCell>
                <TableCell>{materiau.quantity}</TableCell>
                <TableCell>{materiau.unit}</TableCell>
                <TableCell>{materiau.price} DT</TableCell>
                <TableCell>{materiau.supplierId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Materiaux;
