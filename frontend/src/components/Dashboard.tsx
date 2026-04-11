import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Construction as ConstructionIcon,
  ReportProblem as ReportIcon,
} from '@mui/icons-material';
import { userService, projetService, chantierService, incidentsService } from '../services/api';

interface DashboardStats {
  users: number;
  projets: number;
  chantiers: number;
  incidents: number;
}

interface RecentIncident {
  id: string;
  description: string;
  severity: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    projets: 0,
    chantiers: 0,
    incidents: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState<RecentIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, projetsRes, chantiersRes, incidentsRes] = await Promise.allSettled([
          userService.getAll(),
          projetService.getAll(),
          chantierService.getAll(),
          incidentsService.getAll(),
        ]);

        const toCount = (result: PromiseSettledResult<{ data: unknown }>) => {
          if (result.status !== 'fulfilled' || !Array.isArray(result.value.data)) {
            return 0;
          }
          return result.value.data.length;
        };

        setStats({
          users: toCount(usersRes),
          projets: toCount(projetsRes),
          chantiers: toCount(chantiersRes),
          incidents: toCount(incidentsRes),
        });

        if (incidentsRes.status === 'fulfilled' && Array.isArray(incidentsRes.value.data)) {
          const incidents = incidentsRes.value.data.slice(0, 5).map((incident: any) => ({
            id: String(incident.id ?? ''),
            description: incident.description ?? incident.titre ?? 'Incident',
            severity: incident.severity ?? incident.statut ?? 'info',
            createdAt: incident.createdAt ?? new Date().toISOString(),
          }));

          setRecentIncidents(incidents);
        } else {
          setRecentIncidents([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
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
      <Typography variant="h4" gutterBottom>
        Tableau de bord SmartSite
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.users}</Typography>
                  <Typography color="textSecondary">Utilisateurs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BusinessIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.projets}</Typography>
                  <Typography color="textSecondary">Projets</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ConstructionIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.chantiers}</Typography>
                  <Typography color="textSecondary">Chantiers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReportIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.incidents}</Typography>
                  <Typography color="textSecondary">Incidents</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Incidents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Incidents Récents
            </Typography>
            <List>
              {recentIncidents.map((incident) => (
                <ListItem key={incident.id}>
                  <ListItemText
                    primary={incident.description}
                    secondary={new Date(incident.createdAt).toLocaleDateString()}
                  />
                  <Chip
                    label={incident.severity}
                    color={getSeverityColor(incident.severity) as any}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actions Rapides
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Utilisez le menu de navigation pour accéder rapidement à toutes les fonctionnalités.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
