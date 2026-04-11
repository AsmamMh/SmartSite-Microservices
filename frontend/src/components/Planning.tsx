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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { planningService } from '../services/api';

interface PlanningProject {
  id: number;
  name: string;
  description: string;
  plannedStart?: string;
  plannedEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  acctualEnd?: string;
  estimateBudget?: number;
  actualBudget?: number;
  chantierId?: number;
  clientId?: number;
  responsableId?: number;
}

const Planning: React.FC = () => {
  const [plannings, setPlannings] = useState<PlanningProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<PlanningProject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plannedStart: '',
    plannedEnd: '',
    actualStart: '',
    actualEnd: '',
    estimateBudget: '',
    actualBudget: '',
    chantierId: '',
    clientId: '',
    responsableId: '',
  });

  useEffect(() => {
    fetchPlannings();
  }, []);

  const fetchPlannings = async () => {
    try {
      const response = await planningService.getAll();
      setPlannings(Array.isArray(response.data) ? (response.data as PlanningProject[]) : []);
    } catch (error) {
      console.error('Error fetching plannings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toNumberOrNull = (value: string) => {
    if (!value.trim()) {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const buildPayload = () => ({
    name: formData.name,
    description: formData.description || null,
    plannedStart: formData.plannedStart || null,
    plannedEnd: formData.plannedEnd || null,
    actualStart: formData.actualStart || null,
    acctualEnd: formData.actualEnd || null,
    estimateBudget: toNumberOrNull(formData.estimateBudget),
    actualBudget: toNumberOrNull(formData.actualBudget),
    chantierId: toNumberOrNull(formData.chantierId),
    clientId: toNumberOrNull(formData.clientId),
    responsableId: toNumberOrNull(formData.responsableId),
  });

  const handleSubmit = async () => {
    try {
      const payload = buildPayload();

      if (editingPlanning) {
        await planningService.update(editingPlanning.id, payload);
      } else {
        await planningService.create(payload);
      }

      await fetchPlannings();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving planning:', error);
    }
  };

  const handleEdit = (planning: PlanningProject) => {
    setEditingPlanning(planning);
    setFormData({
      name: planning.name || '',
      description: planning.description || '',
      plannedStart: planning.plannedStart || '',
      plannedEnd: planning.plannedEnd || '',
      actualStart: planning.actualStart || '',
      actualEnd: planning.actualEnd || planning.acctualEnd || '',
      estimateBudget: planning.estimateBudget != null ? String(planning.estimateBudget) : '',
      actualBudget: planning.actualBudget != null ? String(planning.actualBudget) : '',
      chantierId: planning.chantierId != null ? String(planning.chantierId) : '',
      clientId: planning.clientId != null ? String(planning.clientId) : '',
      responsableId: planning.responsableId != null ? String(planning.responsableId) : '',
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingPlanning(null);
    setFormData({
      name: '',
      description: '',
      plannedStart: '',
      plannedEnd: '',
      actualStart: '',
      actualEnd: '',
      estimateBudget: '',
      actualBudget: '',
      chantierId: '',
      clientId: '',
      responsableId: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlanning(null);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion du Planning</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Ajouter un planning
        </Button>
      </Box>
      
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
              <TableCell>Actions</TableCell>
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
                <TableCell>{formatDate(planning.actualEnd || planning.acctualEnd)}</TableCell>
                <TableCell>{planning.estimateBudget ?? '-'}</TableCell>
                <TableCell>{planning.actualBudget ?? '-'}</TableCell>
                <TableCell>{planning.chantierId ?? '-'}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(planning)}>
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlanning ? 'Modifier un planning' : 'Ajouter un planning'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date planifiée début"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.plannedStart}
            onChange={(e) => setFormData({ ...formData, plannedStart: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date planifiée fin"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.plannedEnd}
            onChange={(e) => setFormData({ ...formData, plannedEnd: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date réelle début"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.actualStart}
            onChange={(e) => setFormData({ ...formData, actualStart: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date réelle fin"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.actualEnd}
            onChange={(e) => setFormData({ ...formData, actualEnd: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Budget estimé"
            type="number"
            fullWidth
            value={formData.estimateBudget}
            onChange={(e) => setFormData({ ...formData, estimateBudget: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Budget réel"
            type="number"
            fullWidth
            value={formData.actualBudget}
            onChange={(e) => setFormData({ ...formData, actualBudget: e.target.value })}
          />
          <TextField
            margin="dense"
            label="ID Chantier"
            type="number"
            fullWidth
            value={formData.chantierId}
            onChange={(e) => setFormData({ ...formData, chantierId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="ID Client"
            type="number"
            fullWidth
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="ID Responsable"
            type="number"
            fullWidth
            value={formData.responsableId}
            onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Planning;
