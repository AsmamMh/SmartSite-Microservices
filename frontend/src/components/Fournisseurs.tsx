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
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fournisseursService } from '../services/api';

interface Fournisseur {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  actif: boolean;
}

const Fournisseurs: React.FC = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    actif: true,
  });

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await fournisseursService.getAll();
      setFournisseurs(response.data as Fournisseur[]);
    } catch (error) {
      console.error('Error fetching fournisseurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        actif: formData.actif,
      };

      await fournisseursService.create(payload);
      await fetchFournisseurs();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating fournisseur:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      actif: true,
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
        <Typography variant="h4">Gestion des Fournisseurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Ajouter un fournisseur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Actif</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fournisseurs.map((fournisseur) => (
              <TableRow key={fournisseur.id}>
                <TableCell>{fournisseur.id}</TableCell>
                <TableCell>{fournisseur.nom}</TableCell>
                <TableCell>{fournisseur.email}</TableCell>
                <TableCell>{fournisseur.telephone}</TableCell>
                <TableCell>{fournisseur.adresse}</TableCell>
                <TableCell>{fournisseur.actif ? 'Oui' : 'Non'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un fournisseur</DialogTitle>
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
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Téléphone"
            fullWidth
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse"
            fullWidth
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Actif"
            fullWidth
            select
            value={formData.actif ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, actif: e.target.value === 'true' })}
          >
            <MenuItem value="true">Oui</MenuItem>
            <MenuItem value="false">Non</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Fournisseurs;
