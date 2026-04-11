import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Construction as ConstructionIcon,
  Inventory as InventoryIcon,
  ReportProblem as ReportIcon,
  LocalShipping as ShippingIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Projects from './components/Projects';
import Chantiers from './components/Chantiers';
import Materiaux from './components/Materiaux';
import Incidents from './components/Incidents';
import Fournisseurs from './components/Fournisseurs';
import Notifications from './components/Notifications';
import Planning from './components/Planning';
import Tasks from './components/Tasks';
import keycloak, { getUserDisplayName, initKeycloak } from './auth/keycloak';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
  { text: 'Projets', icon: <BusinessIcon />, path: '/projets' },
  { text: 'Chantiers', icon: <ConstructionIcon />, path: '/chantiers' },
  { text: 'Matériaux', icon: <InventoryIcon />, path: '/materiaux' },
  { text: 'Incidents', icon: <ReportIcon />, path: '/incidents' },
  { text: 'Fournisseurs', icon: <ShippingIcon />, path: '/fournisseurs' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Planning', icon: <CalendarIcon />, path: '/planning' },
  { text: 'Tâches', icon: <TaskIcon />, path: '/tasks' },
];



function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        await initKeycloak();
      } catch (error) {
        console.error('Unable to initialize Keycloak', error);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
          <CircularProgress />
          <Typography variant="body1" color="textSecondary">
            Initialisation de la session...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const handleLogout = async () => {
    await keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                SmartSite - Gestion de Chantiers
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                {getUserDisplayName()}
                {keycloak.hasRealmRole('admin') && ' (Admin)'}
                {keycloak.hasRealmRole('manager') && ' (Manager)'}
              </Typography>
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Déconnexion
              </Button>
            </Toolbar>
          </AppBar>
          
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {menuItems.map((item) => (
                  <ListItem disablePadding key={item.text}>
                    <ListItemButton component={RouterLink} to={item.path}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/projets" element={<Projects />} />
              <Route path="/chantiers" element={<Chantiers />} />
              <Route path="/materiaux" element={<Materiaux />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
