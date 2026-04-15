import React, { useEffect, useMemo, useState } from 'react';
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
import { Add as AddIcon, AssignmentInd as AssignIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { planningService, projetService, taskAssignService, taskService, userService } from '../services/api';

interface PlanningProject {
  id: number;
  name: string;
}

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status?: string;
  plannedStart?: string;
  plannedEnd?: string;
  progress?: number;
}

const taskStatuses = ['PLANNED', 'READY', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED'];
const assignmentStatuses = ['SHEDULED', 'EXECUTED', 'ABSENT', 'CANCELLED', 'DELAYED'];

const Tasks: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<PlanningProject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'PLANNED',
    plannedStart: '',
    plannedEnd: '',
  });

  const [assignForm, setAssignForm] = useState({
    workerId: '',
    teamId: '',
    assignedHOurs: '',
    assignedStatus: 'SHEDULED',
    title: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          projetService.getAll(),
          userService.getAll(),
        ]);

        console.log('Fetched projects for planning:', projectsResponse.data);
        console.log('Fetched users for planning:', usersResponse.data);
        const planningProjects = Array.isArray(projectsResponse.data)
          ? (projectsResponse.data as PlanningProject[])
          : [];
        const fetchedUsers = Array.isArray(usersResponse.data) ? (usersResponse.data as User[]) : [];

        setProjects(planningProjects);
        setUsers(fetchedUsers);

        if (planningProjects.length > 0) {
          setSelectedProjectId(planningProjects[0].id);
        }
      } catch (error) {
        console.error('Error loading tasks page data:', error);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProjectId) {
        setTasks([]);
        return;
      }

      try {
        const response = await taskService.getByProject(Number(selectedProjectId));
        setTasks(Array.isArray(response.data) ? (response.data as TaskItem[]) : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    void fetchTasks();
  }, [selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === Number(selectedProjectId)),
    [projects, selectedProjectId]
  );

  const refreshTasks = async () => {
    if (!selectedProjectId) {
      return;
    }
    const response = await taskService.getByProject(Number(selectedProjectId));
    setTasks(Array.isArray(response.data) ? (response.data as TaskItem[]) : []);
  };

  const handleCreateTask = async () => {
    if (!selectedProjectId) {
      return;
    }

    try {
      await taskService.create(Number(selectedProjectId), {
        title: taskForm.title,
        description: taskForm.description || null,
        status: taskForm.status || null,
        plannedStart: taskForm.plannedStart || null,
        plannedEnd: taskForm.plannedEnd || null,
      });
      setOpenTaskDialog(false);
      setTaskForm({ title: '', description: '', status: 'PLANNED', plannedStart: '', plannedEnd: '' });
      await refreshTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Supprimer cette tâche ?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openAssignForTask = (task: TaskItem) => {
    setActiveTaskId(task.id);
    setAssignForm({
      workerId: '',
      teamId: '',
      assignedHOurs: '',
      assignedStatus: 'SHEDULED',
      title: task.title,
      description: task.description || '',
      date: '',
    });
    setOpenAssignDialog(true);
  };

  const handleAssignTask = async () => {
    if (!activeTaskId || !assignForm.workerId) {
      return;
    }

    try {
      await taskAssignService.create(activeTaskId, {
        workerId: assignForm.workerId,
        teamId: assignForm.teamId ? Number(assignForm.teamId) : null,
        assignedHOurs: assignForm.assignedHOurs ? Number(assignForm.assignedHOurs) : null,
        assignedStatus: assignForm.assignedStatus,
        title: assignForm.title || null,
        description: assignForm.description || null,
        date: assignForm.date || null,
      });
      setOpenAssignDialog(false);
      setActiveTaskId(null);
    } catch (error) {
      console.error('Error assigning task:', error);
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
        <Typography variant="h4">Gestion des Tâches</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenTaskDialog(true)} disabled={!selectedProjectId}>
          Ajouter une tâche
        </Button>
      </Box>

      <Box mb={2} maxWidth={360}>
        <TextField
          select
          fullWidth
          label="Projet"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : '')}
        >
          {projects.map((project:any) => (
            <MenuItem key={project.id} value={project.id}>
              {project.nom}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="subtitle1" mb={1}>
        {selectedProject ? `Tâches du projet: ${selectedProject.name}` : 'Sélectionnez un projet'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Début planifié</TableCell>
              <TableCell>Fin planifiée</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
                <TableCell>{task.status || '-'}</TableCell>
                <TableCell>{task.plannedStart ? new Date(task.plannedStart).toLocaleString() : '-'}</TableCell>
                <TableCell>{task.plannedEnd ? new Date(task.plannedEnd).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<AssignIcon />} onClick={() => openAssignForTask(task)}>
                    Affecter
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteTask(task.id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une tâche</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre"
            fullWidth
            required
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Statut"
            select
            fullWidth
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
          >
            {taskStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Début planifié"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={taskForm.plannedStart}
            onChange={(e) => setTaskForm({ ...taskForm, plannedStart: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Fin planifiée"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={taskForm.plannedEnd}
            onChange={(e) => setTaskForm({ ...taskForm, plannedEnd: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateTask} disabled={!taskForm.title.trim() || !selectedProjectId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Affecter la tâche</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Titre d'affectation"
            fullWidth
            value={assignForm.title}
            onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={assignForm.description}
            onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Utilisateur"
            select
            fullWidth
            required
            value={assignForm.workerId}
            onChange={(e) => setAssignForm({ ...assignForm, workerId: e.target.value })}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.nom} {user.prenom} ({user.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="ID Équipe"
            type="number"
            fullWidth
            value={assignForm.teamId}
            onChange={(e) => setAssignForm({ ...assignForm, teamId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Heures assignées"
            type="number"
            fullWidth
            value={assignForm.assignedHOurs}
            onChange={(e) => setAssignForm({ ...assignForm, assignedHOurs: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Statut d'affectation"
            select
            fullWidth
            value={assignForm.assignedStatus}
            onChange={(e) => setAssignForm({ ...assignForm, assignedStatus: e.target.value })}
          >
            {assignmentStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={assignForm.date}
            onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Annuler</Button>
          <Button onClick={handleAssignTask} disabled={!assignForm.workerId}>Affecter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
