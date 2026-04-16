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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { materiauService, Materiau, MouvementStock, Statistiques, PredictionResponse } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
      <div hidden={value !== index} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
  );
}

const Materiaux: React.FC = () => {
  const [materiaux, setMateriaux] = useState<Materiau[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMateriau, setSelectedMateriau] = useState<Materiau | null>(null);
  const [formData, setFormData] = useState<Partial<Materiau>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [tabValue, setTabValue] = useState(0);
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [stockFaible, setStockFaible] = useState<Materiau[]>([]);
  const [historique, setHistorique] = useState<MouvementStock[]>([]);
  const [selectedMateriauId, setSelectedMateriauId] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [heuresPrediction, setHeuresPrediction] = useState(24);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [materiauxRes, statsRes, stockFaibleRes] = await Promise.all([
        materiauService.getAll(),
        materiauService.getStatistiques(),
        materiauService.getStockFaible(),
      ]);
      setMateriaux(materiauxRes.data);
      setStatistiques(statsRes.data);
      setStockFaible(stockFaibleRes.data);
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

  const handleOpenDialog = (materiau?: Materiau) => {
    if (materiau) {
      setSelectedMateriau(materiau);
      setFormData(materiau);
    } else {
      setSelectedMateriau(null);
      setFormData({ actif: true, quantiteStock: 0, seuilAlerte: 10, coutUnitaire: 0 });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMateriau(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (selectedMateriau) {
        await materiauService.update(selectedMateriau.id, formData);
        showSnackbar('Matériau mis à jour avec succès', 'success');
      } else {
        await materiauService.create(formData);
        showSnackbar('Matériau créé avec succès', 'success');
      }
      handleCloseDialog();
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) {
      try {
        await materiauService.delete(id);
        showSnackbar('Matériau supprimé avec succès', 'success');
        fetchAllData();
      } catch (error) {
        showSnackbar('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleStockOperation = async (id: number, type: 'ENTREE' | 'SORTIE', quantite: number) => {
    const commentaire = prompt(`Commentaire pour ${type === 'ENTREE' ? 'l\'entrée' : 'la sortie'} :`);
    try {
      if (type === 'ENTREE') {
        await materiauService.entreeStock(id, quantite, commentaire || undefined);
      } else {
        await materiauService.sortieStock(id, quantite, commentaire || undefined);
      }
      showSnackbar(`Stock ${type === 'ENTREE' ? 'ajouté' : 'retiré'} avec succès`, 'success');
      fetchAllData();
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erreur lors de l\'opération', 'error');
    }
  };

  const handleViewHistorique = async (id: number) => {
    try {
      const res = await materiauService.getHistorique(id);
      setHistorique(res.data);
      setSelectedMateriauId(id);
      setTabValue(2);
    } catch (error) {
      showSnackbar('Erreur lors du chargement de l\'historique', 'error');
    }
  };

  const handlePrediction = async (id: number) => {
    try {
      const res = await materiauService.prediction({ materiauId: id, heures: heuresPrediction });
      setPrediction(res.data);
      setSelectedMateriauId(id);
      setTabValue(3);
    } catch (error) {
      showSnackbar('Erreur lors de la prédiction', 'error');
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

        {/* Statistiques Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Nombre de Matériaux
                </Typography>
                <Typography variant="h4">
                  {statistiques?.nombreMateriaux || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Valeur du Stock Total
                </Typography>
                <Typography variant="h4">
                  {statistiques?.valeurStockTotal || 0} DT
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Stock Faible
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistiques?.stockFaible || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertes Stock Faible */}
        {stockFaible.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle1">⚠️ Alertes Stock Faible :</Typography>
              {stockFaible.map(m => (
                  <Typography key={m.id}>
                    • {m.nom} : {m.quantiteStock} {m.unite} (Seuil: {m.seuilAlerte})
                  </Typography>
              ))}
            </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Liste des Matériaux" />
            <Tab label="Ajouter un Matériau" />
            <Tab label="Historique" disabled={!selectedMateriauId} />
            <Tab label="Prédiction" disabled={!selectedMateriauId} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Nouveau Matériau
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Localisation</TableCell>
                    <TableCell>Unité</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Seuil Alerte</TableCell>
                    <TableCell align="right">Coût Unitaire</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materiaux.filter(m => m.actif).map((materiau) => (
                      <TableRow key={materiau.id} sx={{
                        bgcolor: materiau.quantiteStock < materiau.seuilAlerte ? '#fff3e0' : 'inherit'
                      }}>
                        <TableCell>{materiau.id}</TableCell>
                        <TableCell>{materiau.nom}</TableCell>
                        <TableCell>{materiau.localisation}</TableCell>
                        <TableCell>{materiau.unite}</TableCell>
                        <TableCell align="right">
                          <Chip
                              label={`${materiau.quantiteStock} ${materiau.unite}`}
                              color={materiau.quantiteStock < materiau.seuilAlerte ? 'warning' : 'success'}
                              size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{materiau.seuilAlerte}</TableCell>
                        <TableCell align="right">{materiau.coutUnitaire} DT</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Entrée Stock">
                            <IconButton size="small" onClick={() => {
                              const qte = prompt('Quantité à ajouter:', '10');
                              if (qte) handleStockOperation(materiau.id, 'ENTREE', parseFloat(qte));
                            }}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sortie Stock">
                            <IconButton size="small" onClick={() => {
                              const qte = prompt('Quantité à retirer:', '5');
                              if (qte) handleStockOperation(materiau.id, 'SORTIE', parseFloat(qte));
                            }}>
                              <InventoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Historique">
                            <IconButton size="small" onClick={() => handleViewHistorique(materiau.id)}>
                              <TrendingUpIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Prédiction">
                            <IconButton size="small" onClick={() => handlePrediction(materiau.id)}>
                              <WarningIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => handleOpenDialog(materiau)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" onClick={() => handleDelete(materiau.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" sx={{ maxWidth: 600, mx: 'auto' }}>
              <TextField
                  fullWidth
                  label="Nom"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  margin="normal"
              />
              <TextField
                  fullWidth
                  label="Localisation"
                  value={formData.localisation || ''}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  margin="normal"
              />
              <TextField
                  fullWidth
                  label="Unité"
                  value={formData.unite || ''}
                  onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                  margin="normal"
              />
              <TextField
                  fullWidth
                  type="number"
                  label="Seuil Alerte"
                  value={formData.seuilAlerte || 10}
                  onChange={(e) => setFormData({ ...formData, seuilAlerte: parseFloat(e.target.value) })}
                  margin="normal"
              />
              <TextField
                  fullWidth
                  type="number"
                  label="Coût Unitaire (DT)"
                  value={formData.coutUnitaire || 0}
                  onChange={(e) => setFormData({ ...formData, coutUnitaire: parseFloat(e.target.value) })}
                  margin="normal"
              />
              <Box mt={2} display="flex" gap={2}>
                <Button variant="contained" onClick={handleSave}>
                  {selectedMateriau ? 'Modifier' : 'Créer'}
                </Button>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  Annuler
                </Button>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" mb={2}>Historique des mouvements</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                    <TableCell>Commentaire</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historique.map((mvt) => (
                      <TableRow key={mvt.id}>
                        <TableCell>{new Date(mvt.dateMouvement).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                              label={mvt.type}
                              color={mvt.type === 'ENTREE' ? 'success' : 'error'}
                              size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{mvt.quantite}</TableCell>
                        <TableCell>{mvt.commentaire}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {prediction && (
                <Box>
                  <Typography variant="h6" mb={2}>Prédiction de consommation</Typography>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Matériau</Typography>
                          <Typography variant="h6">{prediction.materiau}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Stock Actuel</Typography>
                          <Typography variant="h6">{prediction.stockActuel} {prediction.unite}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Consommation par heure</Typography>
                          <Typography>{prediction.consommationParHeure} {prediction.unite}/h</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Prédiction pour {heuresPrediction}h</Typography>
                          <Typography>{prediction.prediction} {prediction.unite}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                              type="number"
                              label="Heures de prédiction"
                              value={heuresPrediction}
                              onChange={(e) => setHeuresPrediction(parseInt(e.target.value))}
                              size="small"
                          />
                          <Button
                              variant="contained"
                              onClick={() => selectedMateriauId && handlePrediction(selectedMateriauId)}
                              sx={{ ml: 2 }}
                          >
                            Recalculer
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Alert severity={
                            prediction.alerte.includes('ROUGE') ? 'error' :
                                prediction.alerte.includes('ORANGE') ? 'warning' : 'success'
                          }>
                            {prediction.alerte}
                          </Alert>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
            )}
          </TabPanel>
        </Paper>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
  );
};

export default Materiaux;