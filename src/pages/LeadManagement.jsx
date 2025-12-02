// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   Grid,
//   Paper,
//   IconButton,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Typography
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   FilterList as FilterIcon,
//   ImportExport as ImportExportIcon,
//   Visibility as VisibilityIcon
// } from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid';
// import { useForm } from 'react-hook-form';
// import { leadAPI } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const LeadManagement = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [leads, setLeads] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [filters, setFilters] = useState({});
//   const [pagination, setPagination] = useState({
//     page: 0,
//     pageSize: 20,
//     total: 0
//   });

//   const { register, handleSubmit, reset } = useForm();

//   const fetchLeads = async () => {
//     try {
//       const params = {
//         page: pagination.page + 1,
//         limit: pagination.pageSize,
//         ...filters
//       };
//       const response = await leadAPI.getLeads(params);
//       setLeads(response.data.leads);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total
//       }));
//     } catch (error) {
//       console.error('Error fetching leads:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, [pagination.page, pagination.pageSize, filters]);

//   const handleCreateLead = async (data) => {
//     try {
//       await leadAPI.createLead(data);
//       fetchLeads();
//       setOpenDialog(false);
//       reset();
//     } catch (error) {
//       console.error('Error creating lead:', error);
//     }
//   };

//   const handleViewLead = (id) => {
//     navigate(`/leads/${id}`);
//   };

//   const columns = [
//     { field: 'name', headerName: 'Name', width: 150 },
//     { field: 'email', headerName: 'Email', width: 200 },
//     { field: 'phone', headerName: 'Phone', width: 150 },
//     { field: 'source', headerName: 'Source', width: 120 },
//     { 
//       field: 'status', 
//       headerName: 'Status', 
//       width: 130,
//       renderCell: (params) => (
//         <Chip 
//           label={params.value}
//           color={
//             params.value === 'won' ? 'success' :
//             params.value === 'lost' ? 'error' :
//             params.value === 'qualified' ? 'primary' :
//             params.value === 'contacted' ? 'warning' :
//             'default'
//           }
//           size="small"
//         />
//       )
//     },
//     { 
//       field: 'tags', 
//       headerName: 'Tags', 
//       width: 200,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//           {params.value.map((tag, index) => (
//             <Chip key={index} label={tag} size="small" />
//           ))}
//         </Box>
//       )
//     },
//     { 
//       field: 'assignedTo', 
//       headerName: 'Assigned To', 
//       width: 150,
//     //   valueGetter: (params) => params.value?.name
//     valueGetter: (params) => params?.row?.assignedTo?.name || 'unassigned'
//     },
//     { 
//       field: 'actions', 
//       headerName: 'Actions', 
//       width: 150,
//       renderCell: (params) => (
//         <Box>
//           <IconButton size="small" onClick={() => handleViewLead(params.row._id)}>
//             <VisibilityIcon />
//           </IconButton>
//           <IconButton size="small" onClick={() => {/* Edit */}}>
//             <EditIcon />
//           </IconButton>
//           {user.role !== 'support_agent' && (
//             <IconButton size="small" onClick={() => {/* Delete */}}>
//               <DeleteIcon />
//             </IconButton>
//           )}
//         </Box>
//       )
//     }
//   ];

//   const FilterPanel = () => (
//     <Paper sx={{ p: 2, mb: 2 }}>
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             label="Search"
//             size="small"
//             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <FormControl fullWidth size="small">
//             <InputLabel>Status</InputLabel>
//             <Select
//               label="Status"
//               onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//             >
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="new">New</MenuItem>
//               <MenuItem value="contacted">Contacted</MenuItem>
//               <MenuItem value="qualified">Qualified</MenuItem>
//               <MenuItem value="lost">Lost</MenuItem>
//               <MenuItem value="won">Won</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item>
//           <Button
//             variant="outlined"
//             startIcon={<FilterIcon />}
//             onClick={() => {/* Advanced filter dialog */}}
//           >
//             More Filters
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <Typography variant="h4">Lead Management</Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="contained"
//             startIcon={<ImportExportIcon />}
//             onClick={() => {/* Import dialog */}}
//           >
//             Import
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setOpenDialog(true)}
//           >
//             Add Lead
//           </Button>
//         </Box>
//       </Box>

//       <FilterPanel />

//       <Box sx={{ height: 600, width: '100%' }}>
//         <DataGrid
//           rows={leads}
//           columns={columns}
//           paginationMode="server"
//           rowCount={pagination.total}
//           pageSizeOptions={[20, 50, 100]}
//           paginationModel={pagination}
//           onPaginationModelChange={setPagination}
//           getRowId={(row) => row._id}
//         />
//       </Box>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Add New Lead</DialogTitle>
//         <form onSubmit={handleSubmit(handleCreateLead)}>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Name"
//                   {...register('name', { required: true })}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   {...register('email', { required: true })}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Phone"
//                   {...register('phone', { required: true })}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel>Status</InputLabel>
//                   <Select
//                     label="Status"
//                     defaultValue="new"
//                     {...register('status')}
//                   >
//                     <MenuItem value="new">New</MenuItem>
//                     <MenuItem value="contacted">Contacted</MenuItem>
//                     <MenuItem value="qualified">Qualified</MenuItem>
//                     <MenuItem value="lost">Lost</MenuItem>
//                     <MenuItem value="won">Won</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">Create</Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Box>
//   );
// };

// export default LeadManagement;


import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
  Stack,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  ImportExport as ImportExportIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { leadAPI, userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const LeadManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({});
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const [advancedFilters, setAdvancedFilters] = useState({
    status: '',
    tags: [],
    assignedTo: '',
    source: '',
    dateRange: { start: null, end: null }
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      source: 'website',
      status: 'new',
      tags: [],
      assignedTo: ''
    }
  });

  // Fetch leads with debouncing
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...filters,
        ...advancedFilters
      };

      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await leadAPI.getLeads(params);
      setLeads(response.data.leads || []);
      setTotalLeads(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
      showSnackbar('Error fetching leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters, advancedFilters]);

  // Fetch agents for assignment
  const fetchAgents = async () => {
    try {
      const response = await userAPI.getUsers({ role: 'support_agent' });
      setAgents(response.data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Fetch lead statistics
  const fetchStats = async () => {
    try {
      const response = await leadAPI.getStats?.() || { data: {} };
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAgents();
    fetchStats();
  }, [fetchLeads]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setFilters(prev => ({ ...prev, search: searchValue }));
      setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, 500),
    []
  );

  const handleCreateLead = async (data) => {
    try {
      await leadAPI.createLead(data);
      showSnackbar('Lead created successfully', 'success');
      fetchLeads();
      setOpenDialog(false);
      reset();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error creating lead', 'error');
    }
  };

  const handleUpdateLead = async (data) => {
    try {
      await leadAPI.updateLead(selectedLead._id, data);
      showSnackbar('Lead updated successfully', 'success');
      fetchLeads();
      setOpenDialog(false);
      reset();
      setSelectedLead(null);
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error updating lead', 'error');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.deleteLead(leadId);
        showSnackbar('Lead deleted successfully', 'success');
        fetchLeads();
      } catch (error) {
        showSnackbar(error.response?.data?.error || 'Error deleting lead', 'error');
      }
    }
  };

  const handleViewLead = (id) => {
    navigate(`/leads/${id}`);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      tags: lead.tags || [],
      assignedTo: lead.assignedTo?._id || ''
    });
    setOpenDialog(true);
  };

  const handleExport = async () => {
    try {
      const response = await leadAPI.exportLeads({ ...filters, ...advancedFilters });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showSnackbar('Export started successfully', 'success');
    } catch (error) {
      showSnackbar('Error exporting leads', 'error');
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setAdvancedFilters({
      status: '',
      tags: [],
      assignedTo: '',
      source: '',
      dateRange: { start: null, end: null }
    });
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // DataGrid columns
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="action" fontSize="small" />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon color="action" fontSize="small" />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon color="action" fontSize="small" />
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'source', 
      headerName: 'Source', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value?.replace('_', ' ') || 'Unknown'}
          size="small"
          variant="outlined"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => {
        const statusColors = {
          new: 'default',
          contacted: 'primary',
          qualified: 'warning',
          lost: 'error',
          won: 'success'
        };
        return (
          <Chip 
            label={params.value}
            color={statusColors[params.value] || 'default'}
            size="small"
            variant="filled"
          />
        );
      }
    },
    { 
      field: 'tags', 
      headerName: 'Tags', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value?.slice(0, 2).map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              variant="outlined"
            />
          ))}
          {params.value?.length > 2 && (
            <Chip 
              label={`+${params.value.length - 2}`} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>
      )
    },
    { 
      field: 'assignedTo', 
      headerName: 'Assigned To', 
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.assignedTo?.name || 'Unassigned'}
        </Typography>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created', 
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View details">
            <IconButton 
              size="small" 
              onClick={() => handleViewLead(params.row._id)}
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edit lead">
            <IconButton 
              size="small" 
              onClick={() => handleEditLead(params.row)}
              color="info"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {user.role !== 'support_agent' && (
            <Tooltip title="Delete lead">
              <IconButton
                size="small"
                onClick={() => handleDeleteLead(params.row._id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  // Status distribution for quick stats
  const statusDistribution = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const totalAssigned = leads.filter(lead => lead.assignedTo).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Lead Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLeads}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedLead(null);
              reset();
              setOpenDialog(true);
            }}
          >
            Add Lead
          </Button>
        </Stack>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Leads
              </Typography>
              <Typography variant="h4" color="primary">
                {totalLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                New Leads
              </Typography>
              <Typography variant="h4" color="info.main">
                {statusDistribution.new || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Won Leads
              </Typography>
              <Typography variant="h4" color="success.main">
                {statusDistribution.won || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Assigned Leads
              </Typography>
              <Typography variant="h4" color="warning.main">
                {totalAssigned}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Search Bar */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search leads by name, email, or phone"
              variant="outlined"
              size="small"
              onChange={(e) => debouncedSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                endAdornment: filters.search && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, search: '' }));
                      debouncedSearch('');
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
          </Grid>

          {/* Quick Filters */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={advancedFilters.status || ''}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="qualified">Qualified</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                  <MenuItem value="won">Won</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  label="Assigned To"
                  value={advancedFilters.assignedTo || ''}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                >
                  <MenuItem value="">All Agents</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent._id} value={agent._id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {/* Show advanced filter dialog */}}
              >
                More
              </Button>

              {(filters.search || advancedFilters.status || advancedFilters.assignedTo) && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Leads Table */}
      <Paper sx={{ height: 600, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : leads.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column', gap: 2 }}>
            <SearchIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
            <Typography color="textSecondary" variant="h6">
              No leads found
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {Object.keys(filters).length > 0 || Object.keys(advancedFilters).some(key => advancedFilters[key])
                ? 'Try adjusting your filters'
                : 'Start by adding your first lead'}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={leads}
            columns={columns}
            paginationMode="server"
            rowCount={totalLeads}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
            loading={loading}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          />
        )}
      </Paper>

      {/* Add/Edit Lead Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">
            {selectedLead ? 'Edit Lead' : 'Create New Lead'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit(selectedLead ? handleUpdateLead : handleCreateLead)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: 'Phone is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Source</InputLabel>
                      <Select {...field} label="Source">
                        <MenuItem value="website">Website</MenuItem>
                        <MenuItem value="referral">Referral</MenuItem>
                        <MenuItem value="social_media">Social Media</MenuItem>
                        <MenuItem value="cold_call">Cold Call</MenuItem>
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="contacted">Contacted</MenuItem>
                        <MenuItem value="qualified">Qualified</MenuItem>
                        <MenuItem value="lost">Lost</MenuItem>
                        <MenuItem value="won">Won</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Assign to Agent</InputLabel>
                      <Select {...field} label="Assign to Agent">
                        <MenuItem value="">Unassigned</MenuItem>
                        {agents.map((agent) => (
                          <MenuItem key={agent._id} value={agent._id}>
                            {agent.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={field.value || []}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Add tags..."
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {selectedLead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadManagement;