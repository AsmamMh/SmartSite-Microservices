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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { incidentsService } from '../services/api';

interface Incident {
  id: number;
  titre: string;
  description: string;
  type?: string;
  gravite?: string;
  statut?: string;
  chantierId: string;
  declaredBy?: string;
}

const gravites = ['FAIBLE', 'MOYENNE', 'CRITIQUE'];
const statuts = ['DECLARE', 'EN_COURS', 'RESOLU'];

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '',
    gravite: 'MOYENNE',
    statut: 'DECLARE',
    chantierId: '',
    declaredBy: '',
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await incidentsService.getAll();
      setIncidents(Array.isArray(response.data) ? (response.data as Incident[]) : []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (gravite?: string) => {
    switch ((gravite || '').toUpperCase()) {
      case 'CRITIQUE':
        return 'error';
      case 'MOYENNE':
        return 'warning';
      case 'FAIBLE':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAdd = () => {
    setEditingIncident(null);
    setFormData({
      titre: '',
      description: '',
      type: '',
      gravite: 'MOYENNE',
      statut: 'DECLARE',
      chantierId: '',
      declaredBy: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setFormData({
      titre: incident.titre || '',
      description: incident.description || '',
      type: incident.type || '',
      gravite: incident.gravite || 'MOYENNE',
      statut: incident.statut || 'DECLARE',
      chantierId: incident.chantierId || '',
      declaredBy: incident.declaredBy || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIncident(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        titre: formData.titre,
        description: formData.description,
        type: formData.type || null,
        gravite: formData.gravite,
        statut: formData.statut,
        chantierId: formData.chantierId,
        declaredBy: formData.declaredBy || null,
      };

      if (editingIncident) {
        await incidentsService.update(editingIncident.id, payload);
      } else {
        await incidentsService.create(payload);
      }

      await fetchIncidents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving incident:', error);
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
        <Typography variant="h4">Gestion des Incidents</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Ajouter un incident
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sévérité</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>ID Chantier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.id}</TableCell>
                <TableCell>{incident.titre}</TableCell>
                <TableCell>{incident.description}</TableCell>
                <TableCell>
                  <Chip
                    label={incident.gravite || '-'}
                    color={getSeverityColor(incident.gravite) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{incident.statut || '-'}</TableCell>
                <TableCell>{incident.type || '-'}</TableCell>
                <TableCell>{incident.chantierId}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(incident)}>
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIncident ? 'Modifier un incident' : 'Ajouter un incident'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre"
            fullWidth
            required
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Gravité"
            fullWidth
            select
            value={formData.gravite}
            onChange={(e) => setFormData({ ...formData, gravite: e.target.value })}
          >
            {gravites.map((gravite) => (
              <MenuItem key={gravite} value={gravite}>
                {gravite}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Statut"
            fullWidth
            select
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
          >
            {statuts.map((statut) => (
              <MenuItem key={statut} value={statut}>
                {statut}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="ID Chantier"
            fullWidth
            required
            value={formData.chantierId}
            onChange={(e) => setFormData({ ...formData, chantierId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Déclaré par (ID utilisateur)"
            fullWidth
            value={formData.declaredBy}
            onChange={(e) => setFormData({ ...formData, declaredBy: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!formData.titre.trim() || !formData.chantierId.trim()}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Incidents;
