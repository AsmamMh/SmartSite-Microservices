import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Construction as ConstructionIcon,
  Inventory as InventoryIcon,
  ReportProblem as ReportIcon,
  LocalShipping as ShippingIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon
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
];

function App() {
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
                  <ListItem button key={item.text} component="a" href={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
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
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
