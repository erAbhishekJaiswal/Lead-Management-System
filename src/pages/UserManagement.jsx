// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   Paper,
//   IconButton,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   Snackbar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon
// } from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid';
// import { useForm } from 'react-hook-form';
// import { userAPI } from '../services/api';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   // const { register, handleSubmit, reset, setValue } = useForm();
//   const { register, handleSubmit, reset, setValue, watch } = useForm();
// const watchIsActive = watch('isActive', true); // default true
// const watchRole = watch('role', 'support_agent');

//   const fetchUsers = async () => {
//     try {
//       const response = await userAPI.getUsers();
//       setUsers(response.data);
//     } catch (error) {
//       showSnackbar('Error fetching users', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleCreateUser = async (data) => {
//     try {
//       if (selectedUser) {
//         await userAPI.updateUser(selectedUser._id, data);
//         showSnackbar('User updated successfully', 'success');
//       } else {
//         await userAPI.createUser(data);
//         showSnackbar('User created successfully', 'success');
//       }
//       fetchUsers();
//       handleCloseDialog();
//     } catch (error) {
//       showSnackbar(error.response?.data?.error || 'Error saving user', 'error');
//     }
//   };

//   useEffect(() => {
//   if (selectedUser) {
//     setValue('name', selectedUser.name);
//     setValue('email', selectedUser.email);
//     setValue('role', selectedUser.role);
//     setValue('isActive', selectedUser.isActive); // ✅ add this
//   } else {
//     reset();
//   }
// }, [selectedUser, setValue, reset]);


//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setValue('name', user.name);
//     setValue('email', user.email);
//     setValue('role', user.role);
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await userAPI.deleteUser(id);
//         showSnackbar('User deleted successfully', 'success');
//         fetchUsers();
//       } catch (error) {
//         showSnackbar(error.response?.data?.error || 'Error deleting user', 'error');
//       }
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedUser(null);
//     reset();
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const columns = [
//     { field: 'name', headerName: 'Name', width: 200 },
//     { field: 'email', headerName: 'Email', width: 250 },
//     { 
//       field: 'role', 
//       headerName: 'Role', 
//       width: 150,
//       renderCell: (params) => (
//         <Chip 
//           label={params.value.replace('_', ' ')}
//           color={
//             params.value === 'super_admin' ? 'error' :
//             params.value === 'sub_admin' ? 'warning' :
//             'primary'
//           }
//           size="small"
//         />
//       )
//     },
//     { 
//       field: 'isActive', 
//       headerName: 'Status', 
//       width: 120,
//       renderCell: (params) => (
//         <Chip 
//           label={params.value ? 'Active' : 'Inactive'}
//           color={params.value ? 'success' : 'error'}
//           size="small"
//         />
//       )
//     },
//     { 
//       field: 'lastLogin', 
//       headerName: 'Last Login', 
//       width: 180,
//       valueGetter: (params) => 
//         params.value ? new Date(params.value).toLocaleString() : 'Never'
//     },
//     { 
//       field: 'actions', 
//       headerName: 'Actions', 
//       width: 200,
//       renderCell: (params) => (
//         <Box>
//           <IconButton 
//             size="small" 
//             onClick={() => handleEdit(params.row)}
//             title="Edit"
//           >
//             <EditIcon />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             onClick={() => {/* View activity */}}
//             title="View Activity"
//           >
//             <VisibilityIcon />
//           </IconButton>
//           {params.row.role !== 'super_admin' && (
//             <IconButton 
//               size="small" 
//               onClick={() => handleDelete(params.row._id)}
//               title="Delete"
//               color="error"
//             >
//               <DeleteIcon />
//             </IconButton>
//           )}
//         </Box>
//       )
//     }
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <h1>User Management</h1>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setOpenDialog(true)}
//         >
//           Add User
//         </Button>
//       </Box>

//       <Paper sx={{ height: 600, width: '100%' }}>
//         <DataGrid
//           rows={users}
//           columns={columns}
//           getRowId={(row) => row._id}
//           pageSizeOptions={[10, 25, 50]}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 10 } },
//           }}
//         />
//       </Paper>

//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           {selectedUser ? 'Edit User' : 'Create New User'}
//         </DialogTitle>
//         <form onSubmit={handleSubmit(handleCreateUser)}>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Name"
//                   {...register('name', { required: true })}
//                   disabled={!!selectedUser}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   {...register('email', { required: true })}
//                   disabled={!!selectedUser}
//                 />
//               </Grid>
//               {!selectedUser && (
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     type="password"
//                     {...register('password', { required: !selectedUser })}
//                   />
//                 </Grid>
//               )}
//               <Grid item xs={12}>
//                 {/* <FormControl fullWidth>
//                   <InputLabel>Role</InputLabel>
//                   <Select
//                     label="Role"
//                     defaultValue="support_agent"
//                     {...register('role', { required: true })}
//                   >
//                     <MenuItem value="sub_admin">Sub Admin</MenuItem>
//                     <MenuItem value="support_agent">Support Agent</MenuItem>
//                   </Select>
//                 </FormControl> */}

//                 <FormControl fullWidth>
//   <InputLabel>Role</InputLabel>
//   <Select
//     label="Role"
//     value={watchRole}
//     onChange={(e) => setValue('role', e.target.value)}
//   >
//     <MenuItem value="sub_admin">Sub Admin</MenuItem>
//     <MenuItem value="support_agent">Support Agent</MenuItem>
//   </Select>
// </FormControl>
//               </Grid>
//               {selectedUser && (
//                 <Grid item xs={12}>
//                   {/* <FormControl fullWidth>
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       label="Status"
//                       defaultValue={selectedUser.isActive}
//                       {...register('isActive')}
//                     >
//                       <MenuItem value={true}>Active</MenuItem>
//                       <MenuItem value={false}>Inactive</MenuItem>
//                     </Select>
//                   </FormControl> */}

//                   <FormControl fullWidth>
//   <InputLabel>Status</InputLabel>
//   <Select
//   label="Status"
//   value={watchIsActive}
//   onChange={(e) => setValue('isActive', e.target.value === 'true')}
// >
//   <MenuItem value={true}>Active</MenuItem>
//   <MenuItem value={false}>Inactive</MenuItem>
// </Select>

// </FormControl>
//                 </Grid>
//               )}
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               {selectedUser ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default UserManagement;










import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Typography,
  Tooltip,
  CircularProgress,
  TablePagination,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { userAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'support_agent',
      isActive: true
    }
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchTerm || undefined
      };
      
      const response = await userAPI.getUsers(params);
      setUsers(response.data);
      setTotalUsers(response.data.length); // Adjust based on your API response
    } catch (error) {
      showSnackbar('Error fetching users', 'error');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize, searchTerm]);

  // Handle create/update user
  const handleSaveUser = async (data) => {
    try {
      if (selectedUser) {
        // For update, remove password field if empty
        if (!data.password) {
          delete data.password;
        }
        await userAPI.updateUser(selectedUser._id, data);
        showSnackbar('User updated successfully', 'success');
      } else {
        // For create, password is required
        if (!data.password) {
          showSnackbar('Password is required for new users', 'error');
          return;
        }
        await userAPI.createUser(data);
        showSnackbar('User created successfully', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error saving user';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '' // Don't show existing password
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await userAPI.deleteUser(id);
        showSnackbar('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error deleting user';
        showSnackbar(errorMessage, 'error');
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (window.confirm(`Are you sure you want to ${action} user "${user.name}"?`)) {
      try {
        await userAPI.updateUser(user._id, { isActive: newStatus });
        showSnackbar(`User ${action}d successfully`, 'success');
        fetchUsers();
      } catch (error) {
        showSnackbar('Error updating user status', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    reset();
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on search
  };

  // DataGrid columns
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="action" fontSize="small" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value.replace('_', ' ')}
          color={
            params.value === 'super_admin' ? 'error' :
            params.value === 'sub_admin' ? 'warning' :
            'info'
          }
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
          icon={params.value ? <CheckCircleIcon /> : <BlockIcon />}
        />
      )
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 180,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleString() : 'Never',
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit user">
            <IconButton 
              size="small" 
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={params.row.isActive ? "Deactivate user" : "Activate user"}>
            <IconButton 
              size="small" 
              onClick={() => handleToggleStatus(params.row)}
              color={params.row.isActive ? "warning" : "success"}
            >
              {params.row.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          {params.row.role !== 'super_admin' && (
            <Tooltip title="Delete user">
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row._id, params.row.name)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    superAdmin: users.filter(u => u.role === 'super_admin').length,
    subAdmin: users.filter(u => u.role === 'sub_admin').length,
    supportAgent: users.filter(u => u.role === 'support_agent').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Active Users
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Support Agents
              </Typography>
              <Typography variant="h4" color="info.main">
                {stats.supportAgent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Admins
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.superAdmin + stats.subAdmin}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search users by name or email"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    sx={{ mr: -1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ height: 600, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column' }}>
            <Typography color="textSecondary" variant="h6" gutterBottom>
              No users found
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {searchTerm ? 'Try changing your search criteria' : 'Start by adding your first user'}
            </Typography>
          </Box>
        ) : (
          <>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row._id}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              rowCount={totalUsers}
              paginationMode="server"
              loading={loading}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none'
                }
              }}
            />
            <TablePagination
              component="div"
              count={totalUsers}
              page={paginationModel.page}
              onPageChange={(e, newPage) => setPaginationModel({ ...paginationModel, page: newPage })}
              rowsPerPage={paginationModel.pageSize}
              onRowsPerPageChange={(e) => setPaginationModel({ page: 0, pageSize: parseInt(e.target.value, 10) })}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">
            {selectedUser ? 'Edit User' : 'Create New User'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveUser)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Name Field */}
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
                      disabled={!!selectedUser}
                    />
                  )}
                />
              </Grid>

              {/* Email Field */}
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
                      disabled={!!selectedUser}
                    />
                  )}
                />
              </Grid>

              {/* Password Field (only for new users) */}
              {!selectedUser && (
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type="password"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Role Field */}
              <Grid item xs={12}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select {...field} label="Role">
                        <MenuItem value="sub_admin">Sub Admin</MenuItem>
                        <MenuItem value="support_agent">Support Agent</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Status Field (only for editing) */}
              {selectedUser && (
                <Grid item xs={12}>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          {...field}
                          label="Status"
                          value={field.value ? 'true' : 'false'}
                          onChange={(e) => field.onChange(e.target.value === 'true')}
                        >
                          <MenuItem value="true">Active</MenuItem>
                          <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Update User' : 'Create User'}
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

export default UserManagement;

