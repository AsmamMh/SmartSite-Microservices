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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { materiauService } from '../services/api';

interface Materiau {
  id: number;
  nom: string;
  pays: string;
  unite: string;
  quantite: number;
  coutUnitaire: number;
}

const Materiaux: React.FC = () => {
  const [materiaux, setMateriaux] = useState<Materiau[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    pays: '',
    unite: '',
    quantite: '',
    coutUnitaire: '',
  });

  useEffect(() => {
    fetchMateriaux();
  }, []);

  const fetchMateriaux = async () => {
    try {
      const response = await materiauService.getAll();
      setMateriaux(response.data as Materiau[]);
    } catch (error) {
      console.error('Error fetching materiaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        pays: formData.pays,
        unite: formData.unite,
        quantite: formData.quantite ? Number(formData.quantite) : 0,
        coutUnitaire: formData.coutUnitaire ? Number(formData.coutUnitaire) : 0,
      };

      await materiauService.create(payload);
      await fetchMateriaux();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating materiau:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      nom: '',
      pays: '',
      unite: '',
      quantite: '',
      coutUnitaire: '',
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion des Matériaux</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Ajouter un matériau
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Coût unitaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiaux.map((materiau) => (
              <TableRow key={materiau.id}>
                <TableCell>{materiau.id}</TableCell>
                <TableCell>{materiau.nom}</TableCell>
                <TableCell>{materiau.pays}</TableCell>
                <TableCell>{materiau.quantite}</TableCell>
                <TableCell>{materiau.unite}</TableCell>
                <TableCell>{materiau.coutUnitaire} DT</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un matériau</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Pays"
            fullWidth
            value={formData.pays}
            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantité"
            type="number"
            fullWidth
            value={formData.quantite}
            onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Unité"
            fullWidth
            value={formData.unite}
            onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Coût unitaire"
            type="number"
            fullWidth
            value={formData.coutUnitaire}
            onChange={(e) => setFormData({ ...formData, coutUnitaire: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Materiaux;
