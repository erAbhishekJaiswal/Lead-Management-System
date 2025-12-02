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
//   ImportExport as ImportExportIcon
// } from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid';
// import { useForm } from 'react-hook-form';
// import { leadAPI } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const LeadManagement = () => {
//   const { user } = useAuth();
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

//   const handleUpdateLead = async (id, updates) => {
//     try {
//       await leadAPI.updateLead(id, updates);
//       fetchLeads();
//     } catch (error) {
//       console.error('Error updating lead:', error);
//     }
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
//       valueGetter: (params) => params.value?.name
//     },
//     { 
//       field: 'actions', 
//       headerName: 'Actions', 
//       width: 150,
//       renderCell: (params) => (
//         <Box>
//           <IconButton size="small" onClick={() => handleEdit(params.row)}>
//             <EditIcon />
//           </IconButton>
//           {user.role !== 'support_agent' && (
//             <IconButton size="small" onClick={() => handleDelete(params.row._id)}>
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