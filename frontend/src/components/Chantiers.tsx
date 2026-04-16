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
  Button,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { chantierService } from '../services/api';

interface Chantier {
  id: string;
  nom: string;
  adresse: string;
  statut: string;
  dateDebut: string;
  description?: string;
  budget?: number;
}

interface NewChantierForm {
  nom: string;
  adresse: string;
  statut: string;
  dateDebut: string;
  description: string;
}

const Chantiers: React.FC = () => {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<NewChantierForm>({
    nom: '',
    adresse: '',
    statut: 'EN_ATTENTE',
    dateDebut: new Date().toISOString().split('T')[0],
    description: '',
  });

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

  const handleOpenModal = () => {
    setOpenModal(true);
    setError(null);
    setSuccess(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      nom: '',
      adresse: '',
      statut: 'EN_ATTENTE',
      dateDebut: new Date().toISOString().split('T')[0],
      description: '',
    });
    setError(null);
    setSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.nom.trim()) {
      setError('Le nom du chantier est requis');
      return;
    }
    if (!formData.adresse.trim()) {
      setError('L\'adresse est requise');
      return;
    }
    if (!formData.dateDebut) {
      setError('La date de début est requise');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await chantierService.create({
        nom: formData.nom,
        adresse: formData.adresse,
        statut: formData.statut,
        dateDebut: formData.dateDebut,
        description: formData.description || null,
      });
      setSuccess(true);
      setTimeout(() => {
        handleCloseModal();
        fetchChantiers(); // Refresh the list
      }, 1500);
    } catch (err) {
      console.error('Error creating chantier:', err);
      setError('Erreur lors de la création du chantier');
    } finally {
      setSubmitting(false);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion des Chantiers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Ajouter un Chantier
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de début</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chantiers.map((chantier) => (
              <TableRow key={chantier.id}>
                <TableCell>{chantier.id}</TableCell>
                <TableCell>{chantier.nom}</TableCell>
                <TableCell>{chantier.adresse}</TableCell>
                <TableCell>{chantier.statut}</TableCell>
                <TableCell>{new Date(chantier.dateDebut).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Chantier Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouveau chantier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Chantier créé avec succès!</Alert>}
            
            <TextField
              label="Nom du chantier"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              fullWidth
              placeholder="Ex: Chantier Centre Commercial"
              disabled={submitting || success}
            />
            
            <TextField
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              fullWidth
              placeholder="Ex: Tunis, Avenue Habib Bourguiba"
              disabled={submitting || success}
            />
            
            <TextField
              label="Date de début"
              name="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={submitting || success}
            />
            
            <TextField
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleInputChange}
              fullWidth
              select
              SelectProps={{ native: true }}
              disabled={submitting || success}
            >
              <option value="EN_ATTENTE">En Attente</option>
              <option value="EN_COURS">En Cours</option>
              <option value="EN_PAUSE">En Pause</option>
              <option value="TERMINE">Terminé</option>
              <option value="ANNULE">Annulé</option>
            </TextField>
            
            <TextField
              label="Description (optionnel)"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Description du chantier..."
              disabled={submitting || success}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={submitting || success}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting || success}
          >
            {submitting ? 'Création en cours...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chantiers;
