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
import { userService } from '../services/api';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste?: string;
  role: string;
  actif: boolean;
}

interface UserFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  role: string;
  actif: boolean;
  password: string;
}

const roles = ['ADMIN', 'CHEF_CHANTIER', 'OUVRIER', 'TECHNICIEN', 'RESPONSABLE'];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    role: '',
    actif: true,
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      console.log('Fetched users:', response.data);
      setUsers(response.data as User[]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        poste: formData.poste,
        role: formData.role,
        actif: formData.actif,
        password: formData.password || undefined,
      };

      if (editingUser) {
        await userService.update(editingUser.id, payload);
      } else {
        await userService.create(payload);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.log(error)
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone || '',
      poste: user.poste || '',
      role: user.role,
      actif: user.actif,
      password: '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', poste: '', role: '', actif: true, password: '' });
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
        <Typography variant="h4">Gestion des Utilisateurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actif</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.poste || '-'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.actif ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(user.id)}
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
          {editingUser ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
        </DialogTitle>
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
            label="Prénom"
            fullWidth
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
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
            label="Poste"
            fullWidth
            value={formData.poste}
            onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Rôle"
            fullWidth
            select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
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
          <TextField
            margin="dense"
            label={editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            type="password"
            fullWidth
            required={!editingUser}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

export default Users;
