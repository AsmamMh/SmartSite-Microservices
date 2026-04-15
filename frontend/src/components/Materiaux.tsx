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
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { materiauService } from '../services/api';

interface Materiau {
  id: number;
  nom: string;
  pays: string;
  unite: string;
  quantite: number;
  coutUnitaire: number;
  seuilAlerte: number | null;
}

interface Prediction {
  materiauId: number;
  nomMateriau: string;
  stockActuel: number;
  seuilAlerte: number;
  consommationMoyenneParHeure: number;
  heuresRestantesEstimees: number;
  risqueRupture: boolean;
  recommandation: string;
  historiquePoints: number;
}

interface Statistiques {
  nombreMateriaux: number;
  nombreAlertesStock: number;
  valeurStockTotale: number;
}

const Materiaux: React.FC = () => {
  const [materiaux, setMateriaux] = useState<Materiau[]>([]);
  const [alertes, setAlertes] = useState<Materiau[]>([]);
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPredictionDialog, setOpenPredictionDialog] = useState(false);
  const [openConsommationDialog, setOpenConsommationDialog] = useState(false);
  const [editingMateriau, setEditingMateriau] = useState<Materiau | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [selectedMateriauId, setSelectedMateriauId] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [consommationData, setConsommationData] = useState({
    quantite: '',
    chantierId: '',
  });

  const [formData, setFormData] = useState({
    nom: '',
    pays: '',
    unite: '',
    quantite: '',
    coutUnitaire: '',
    seuilAlerte: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [materiauxRes, alertesRes, statsRes] = await Promise.all([
        materiauService.getAll(),
        materiauService.getAlertes(),
        materiauService.getStatistiques(),
      ]);
      setMateriaux(materiauxRes.data as Materiau[]);
      setAlertes(alertesRes.data as Materiau[]);
      setStatistiques(statsRes.data as Statistiques);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePredict = async (id: number) => {
    try {
      const res = await materiauService.getPrediction(id);
      setPrediction(res.data as Prediction);
      setSelectedMateriauId(id);
      setOpenPredictionDialog(true);
    } catch (error) {
      console.error('Error getting prediction:', error);
      showSnackbar('Erreur lors de la prédiction', 'error');
    }
  };

  const handleConsommer = async (id: number) => {
    setSelectedMateriauId(id);
    setConsommationData({ quantite: '', chantierId: '' });
    setOpenConsommationDialog(true);
  };

  const submitConsommation = async () => {
    if (!selectedMateriauId) return;
    if (!consommationData.quantite || !consommationData.chantierId) {
      showSnackbar('Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      await materiauService.consommer(
          selectedMateriauId,
          parseFloat(consommationData.quantite),
          parseInt(consommationData.chantierId)
      );
      showSnackbar('Consommation enregistrée avec succès', 'success');
      setOpenConsommationDialog(false);
      fetchAllData();
    } catch (error) {
      console.error('Error recording consumption:', error);
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        pays: formData.pays,
        unite: formData.unite,
        quantite: parseFloat(formData.quantite),
        coutUnitaire: parseFloat(formData.coutUnitaire),
        seuilAlerte: formData.seuilAlerte ? parseFloat(formData.seuilAlerte) : null,
      };

      if (editingMateriau) {
        await materiauService.update(editingMateriau.id, payload);
        showSnackbar('Matériau modifié avec succès', 'success');
      } else {
        await materiauService.create(payload);
        showSnackbar('Matériau ajouté avec succès', 'success');
      }
      await fetchAllData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving materiau:', error);
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) {
      try {
        await materiauService.delete(id);
        showSnackbar('Matériau supprimé avec succès', 'success');
        await fetchAllData();
      } catch (error) {
        console.error('Error deleting materiau:', error);
        showSnackbar('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleEdit = (materiau: Materiau) => {
    setEditingMateriau(materiau);
    setFormData({
      nom: materiau.nom,
      pays: materiau.pays,
      unite: materiau.unite,
      quantite: String(materiau.quantite),
      coutUnitaire: String(materiau.coutUnitaire),
      seuilAlerte: materiau.seuilAlerte ? String(materiau.seuilAlerte) : '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMateriau(null);
    setFormData({ nom: '', pays: '', unite: '', quantite: '', coutUnitaire: '', seuilAlerte: '' });
  };

  const getStockStatus = (quantite: number, seuil: number | null) => {
    if (seuil && quantite <= seuil) {
      return { label: 'Stock critique', color: 'error', icon: <CancelIcon fontSize="small" /> };
    }
    if (quantite < 10) {
      return { label: 'Stock faible', color: 'warning', icon: <WarningIcon fontSize="small" /> };
    }
    return { label: 'Stock OK', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
  };

  if (loading) {
    return (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Chargement des matériaux...</Typography>
          </Box>
        </Box>
    );
  }

  return (
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Gestion des Matériaux
          </Typography>
          <Box>
            <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAllData}
                sx={{ mr: 2 }}
            >
              Actualiser
            </Button>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
            >
              Ajouter un matériau
            </Button>
          </Box>
        </Box>

        {/* Statistiques Cards */}
        {statistiques && (
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <InventoryIcon sx={{ fontSize: 48, color: '#1976d2', mr: 2 }} />
                      <Box>
                        <Typography variant="h3" fontWeight="bold">
                          {statistiques.nombreMateriaux}
                        </Typography>
                        <Typography color="textSecondary">Matériaux</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#ffebee', height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <WarningIcon sx={{ fontSize: 48, color: '#d32f2f', mr: 2 }} />
                      <Box>
                        <Typography variant="h3" fontWeight="bold" color="error">
                          {statistiques.nombreAlertesStock}
                        </Typography>
                        <Typography color="textSecondary">Alertes stock</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <TrendingUpIcon sx={{ fontSize: 48, color: '#2e7d32', mr: 2 }} />
                      <Box>
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {statistiques.valeurStockTotale.toLocaleString()} DT
                        </Typography>
                        <Typography color="textSecondary">Valeur totale du stock</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        )}

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label={`Tous les matériaux (${materiaux.length})`} />
          <Tab label={`Alertes (${alertes.length})`} sx={{ color: alertes.length > 0 ? 'error.main' : 'inherit' }} />
        </Tabs>

        {/* Tableau */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell>Unité</TableCell>
                <TableCell align="right">Coût unitaire</TableCell>
                <TableCell align="right">Seuil alerte</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? materiaux : alertes).map((materiau) => {
                const status = getStockStatus(materiau.quantite, materiau.seuilAlerte);
                return (
                    <TableRow
                        key={materiau.id}
                        sx={status.color === 'error' ? { bgcolor: '#ffebee' } : {}}
                    >
                      <TableCell>{materiau.id}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">{materiau.nom}</Typography>
                      </TableCell>
                      <TableCell>{materiau.pays || '-'}</TableCell>
                      <TableCell align="right">
                        <Typography
                            fontWeight={status.color === 'error' ? 'bold' : 'normal'}
                            color={status.color === 'error' ? 'error' : 'inherit'}
                        >
                          {materiau.quantite}
                        </Typography>
                      </TableCell>
                      <TableCell>{materiau.unite}</TableCell>
                      <TableCell align="right">{materiau.coutUnitaire} DT</TableCell>
                      <TableCell align="right">
                        {materiau.seuilAlerte ? `${materiau.seuilAlerte} ${materiau.unite}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                            icon={status.icon}
                            label={status.label}
                            color={status.color as any}
                            size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Enregistrer consommation">
                          <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleConsommer(materiau.id)}
                          >
                            <InventoryIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Prédiction IA">
                          <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handlePredict(materiau.id)}
                          >
                            <ShowChartIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(materiau)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(materiau.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog Ajout/Modification */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
            {editingMateriau ? 'Modifier un matériau' : 'Ajouter un matériau'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
                autoFocus
                margin="dense"
                label="Nom du matériau"
                fullWidth
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Pays d'origine"
                fullWidth
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Unité de mesure"
                fullWidth
                placeholder="kg, m³, tonnes, litres, etc."
                value={formData.unite}
                onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Quantité"
                type="number"
                fullWidth
                required
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Coût unitaire (DT)"
                type="number"
                fullWidth
                required
                value={formData.coutUnitaire}
                onChange={(e) => setFormData({ ...formData, coutUnitaire: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Seuil d'alerte"
                type="number"
                fullWidth
                helperText="Laissez vide si aucun seuil"
                value={formData.seuilAlerte}
                onChange={(e) => setFormData({ ...formData, seuilAlerte: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!formData.nom || !formData.quantite || !formData.coutUnitaire}
            >
              {editingMateriau ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Prédiction IA */}
        <Dialog open={openPredictionDialog} onClose={() => setOpenPredictionDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#9c27b0', color: 'white' }}>
            🤖 Prédiction IA - Rupture de stock
          </DialogTitle>
          <DialogContent>
            {prediction && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Alert severity={prediction.risqueRupture ? 'error' : 'success'} sx={{ mb: 2 }}>
                        <Typography variant="h6">{prediction.recommandation}</Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Matériau</Typography>
                          <Typography variant="h6">{prediction.nomMateriau}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Stock actuel</Typography>
                          <Typography variant="h6" color={prediction.risqueRupture ? 'error' : 'success'}>
                            {prediction.stockActuel} unités
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Consommation moyenne</Typography>
                          <Typography variant="h6">{prediction.consommationMoyenneParHeure} unités/heure</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Heures restantes estimées</Typography>
                          <Typography variant="h6" color={prediction.heuresRestantesEstimees < 48 ? 'error' : 'success'}>
                            {prediction.heuresRestantesEstimees} heures
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Seuil d'alerte</Typography>
                          <Typography variant="h6">{prediction.seuilAlerte || 'Non défini'}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">Points d'historique</Typography>
                          <Typography variant="h6">{prediction.historiquePoints}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPredictionDialog(false)} variant="contained">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Consommation */}
        <Dialog open={openConsommationDialog} onClose={() => setOpenConsommationDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Enregistrer une consommation</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Quantité consommée"
                type="number"
                fullWidth
                required
                value={consommationData.quantite}
                onChange={(e) => setConsommationData({ ...consommationData, quantite: e.target.value })}
            />
            <TextField
                margin="dense"
                label="ID du chantier"
                type="number"
                fullWidth
                required
                value={consommationData.chantierId}
                onChange={(e) => setConsommationData({ ...consommationData, chantierId: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConsommationDialog(false)}>Annuler</Button>
            <Button onClick={submitConsommation} variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default Materiaux;