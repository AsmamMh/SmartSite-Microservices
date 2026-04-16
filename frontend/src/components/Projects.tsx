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
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { projetService, userService } from '../services/api';

interface Project {
  id: number;
  nom: string;
  description: string;
  client?: string;
  budget?: number;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
}

interface UserOption {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

const statuts = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    client: '',
    budget: '',
    statut: 'EN_ATTENTE',
    dateDebut: '',
    dateFin: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsResponse, usersResponse] = await Promise.all([
        projetService.getAll(),
        userService.getAll(),
      ]);

      setProjects(projectsResponse.data as Project[]);
      setUsers(usersResponse.data as UserOption[]);
    } catch (error) {
      console.error('Error fetching projects/users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projetService.getAll();
      setProjects(response.data as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        description: formData.description || null,
        client: formData.client || null,
        budget: formData.budget ? Number(formData.budget) : null,
        statut: formData.statut || null,
        dateDebut: formData.dateDebut || null,
        dateFin: formData.dateFin || null,
      };

      if (editingProject) {
        await projetService.update(Number(editingProject.id), payload);
      } else {
        await projetService.create(payload);
      }
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      nom: project.nom,
      description: project.description || '',
      client: project.client || '',
      budget: project.budget != null ? String(project.budget) : '',
      statut: project.statut || 'EN_ATTENTE',
      dateDebut: project.dateDebut || '',
      dateFin: project.dateFin || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projetService.delete(id as number);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({ nom: '', description: '', client: '', budget: '', statut: 'EN_ATTENTE', dateDebut: '', dateFin: '' });
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
        <Typography variant="h4">Gestion des Projets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter un projet
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.nom}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.statut || '-'}</TableCell>
                <TableCell>{project.dateDebut ? new Date(project.dateDebut).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{project.dateFin ? new Date(project.dateFin).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(project)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(project.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingProject ? 'Modifier un projet' : 'Ajouter un projet'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du projet"
            fullWidth
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
            label="Client (Utilisateur)"
            fullWidth
            select
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          >
            <MenuItem value="">Aucun</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.email}>
                {`${user.prenom || ''} ${user.nom || ''}`.trim()} ({user.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Budget"
            type="number"
            fullWidth
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
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
            label="Date de début"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dateDebut}
            onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date de fin"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dateFin}
            onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
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

export default Projects;
