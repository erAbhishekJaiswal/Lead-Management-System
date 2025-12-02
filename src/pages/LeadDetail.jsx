// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Chip,
//   Button,
//   TextField,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Avatar,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Source as SourceIcon,
//   Assignment as AssignmentIcon,
//   AccessTime as AccessTimeIcon,
//   Add as AddIcon,
//   Label as LabelIcon
// } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { leadAPI, userAPI, tagAPI, noteAPI } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const LeadDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [lead, setLead] = useState(null);
//   const [agents, setAgents] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [openTagDialog, setOpenTagDialog] = useState(false);
//   const [newNote, setNewNote] = useState('');
//   const [newTag, setNewTag] = useState('');
//   const [selectedTags, setSelectedTags] = useState([]);

//   useEffect(() => {
//     fetchLead();
//     fetchAgents();
//     fetchTags();
//   }, [id]);

//   const fetchLead = async () => {
//     try {
//       const response = await leadAPI.getLeads({ search: id });
//       if (response.data.leads.length > 0) {
//         setLead(response.data.leads[0]);
//       }
//     } catch (error) {
//       console.error('Error fetching lead:', error);
//     }
//   };

//   const fetchAgents = async () => {
//     try {
//       const response = await userAPI.getUsers({ role: 'support_agent' });
//       setAgents(response.data);
//     } catch (error) {
//       console.error('Error fetching agents:', error);
//     }
//   };

//   const fetchTags = async () => {
//     try {
//       const response = await tagAPI.getAllTags();
//       setTags(response.data);
//     } catch (error) {
//       console.error('Error fetching tags:', error);
//     }
//   };

//   const handleUpdateStatus = async (newStatus) => {
//     try {
//       await leadAPI.updateLead(id, { status: newStatus });
//       fetchLead();
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const handleAssignAgent = async (agentId) => {
//     try {
//       await leadAPI.updateLead(id, { assignedTo: agentId });
//       fetchLead();
//     } catch (error) {
//       console.error('Error assigning agent:', error);
//     }
//   };

//   const handleAddNote = async () => {
//     if (!newNote.trim()) return;
    
//     try {
//       await noteAPI.addNote(id, { content: newNote });
//       setNewNote('');
//       setOpenNoteDialog(false);
//       fetchLead();
//     } catch (error) {
//       console.error('Error adding note:', error);
//     }
//   };

//   const handleAddTags = async () => {
//     try {
//       await tagAPI.updateLeadTags(id, { 
//         tags: selectedTags, 
//         action: 'add' 
//       });
//       setSelectedTags([]);
//       setOpenTagDialog(false);
//       fetchLead();
//     } catch (error) {
//       console.error('Error adding tags:', error);
//     }
//   };

//   const handleRemoveTag = async (tag) => {
//     try {
//       await tagAPI.updateLeadTags(id, { 
//         tags: [tag], 
//         action: 'remove' 
//       });
//       fetchLead();
//     } catch (error) {
//       console.error('Error removing tag:', error);
//     }
//   };

//   if (!lead) {
//     return <Typography>Loading...</Typography>;
//   }

//   const statusColors = {
//     new: 'default',
//     contacted: 'primary',
//     qualified: 'warning',
//     lost: 'error',
//     won: 'success'
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ p: 3 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate('/leads')}
//           sx={{ mb: 3 }}
//         >
//           Back to Leads
//         </Button>

//         <Grid container spacing={3}>
//           {/* Lead Information */}
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//                 <Typography variant="h4">{lead.name}</Typography>
//                 <Box>
//                   <IconButton>
//                     <EditIcon />
//                   </IconButton>
//                   {user.role !== 'support_agent' && (
//                     <IconButton color="error">
//                       <DeleteIcon />
//                     </IconButton>
//                   )}
//                 </Box>
//               </Box>

//               <Grid container spacing={2} sx={{ mb: 3 }}>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                     <EmailIcon color="action" />
//                     <Typography variant="body1">{lead.email}</Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                     <PhoneIcon color="action" />
//                     <Typography variant="body1">{lead.phone}</Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                     <SourceIcon color="action" />
//                     <Typography variant="body1" textTransform="capitalize">
//                       {lead.source.replace('_', ' ')}
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                     <AccessTimeIcon color="action" />
//                     <Typography variant="body1">
//                       Created: {new Date(lead.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>

//               <Divider sx={{ my: 3 }} />

//               {/* Status and Assignment */}
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>Status</Typography>
//                   <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                     {['new', 'contacted', 'qualified', 'lost', 'won'].map((status) => (
//                       <Chip
//                         key={status}
//                         label={status}
//                         color={statusColors[status]}
//                         variant={lead.status === status ? 'filled' : 'outlined'}
//                         onClick={() => handleUpdateStatus(status)}
//                         sx={{ textTransform: 'capitalize' }}
//                       />
//                     ))}
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>Assigned Agent</Typography>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Assign to</InputLabel>
//                     <Select
//                       value={lead.assignedTo?._id || ''}
//                       label="Assign to"
//                       onChange={(e) => handleAssignAgent(e.target.value)}
//                     >
//                       <MenuItem value="">Unassigned</MenuItem>
//                       {agents.map((agent) => (
//                         <MenuItem key={agent._id} value={agent._id}>
//                           {agent.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>

//               {/* Tags */}
//               <Box sx={{ mt: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//                   <Typography variant="h6">Tags</Typography>
//                   <Button
//                     size="small"
//                     startIcon={<AddIcon />}
//                     onClick={() => setOpenTagDialog(true)}
//                   >
//                     Add Tag
//                   </Button>
//                 </Box>
//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                   {lead.tags.map((tag, index) => (
//                     <Chip
//                       key={index}
//                       label={tag}
//                       onDelete={() => handleRemoveTag(tag)}
//                       deleteIcon={<LabelIcon />}
//                     />
//                   ))}
//                 </Box>
//               </Box>
//             </Paper>

//             {/* Notes Section */}
//             <Paper sx={{ p: 3, mt: 3 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//                 <Typography variant="h6">Notes</Typography>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={() => setOpenNoteDialog(true)}
//                 >
//                   Add Note
//                 </Button>
//               </Box>

//               <List>
//                 {lead.notes.map((note) => (
//                   <React.Fragment key={note._id}>
//                     <ListItem alignItems="flex-start">
//                       <ListItemAvatar>
//                         <Avatar>
//                           {note.createdBy?.name?.charAt(0) || 'U'}
//                         </Avatar>
//                       </ListItemAvatar>
//                       <ListItemText
//                         primary={note.content}
//                         secondary={
//                           <>
//                             <Typography
//                               component="span"
//                               variant="body2"
//                               color="text.primary"
//                             >
//                               {note.createdBy?.name}
//                             </Typography>
//                             {` — ${new Date(note.createdAt).toLocaleString()}`}
//                           </>
//                         }
//                       />
//                     </ListItem>
//                     <Divider variant="inset" component="li" />
//                   </React.Fragment>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           {/* Sidebar - Activity Log */}
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom>Activity Log</Typography>
//               <List dense>
//                 <ListItem>
//                   <ListItemText
//                     primary="Lead created"
//                     secondary={new Date(lead.createdAt).toLocaleString()}
//                   />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText
//                     primary="Last updated"
//                     secondary={new Date(lead.updatedAt).toLocaleString()}
//                   />
//                 </ListItem>
//                 {lead.assignedTo && (
//                   <ListItem>
//                     <ListItemText
//                       primary="Assigned to"
//                       secondary={lead.assignedTo.name}
//                     />
//                   </ListItem>
//                 )}
//               </List>
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* Add Note Dialog */}
//         <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)}>
//           <DialogTitle>Add Note</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Note"
//               fullWidth
//               multiline
//               rows={4}
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenNoteDialog(false)}>Cancel</Button>
//             <Button onClick={handleAddNote} variant="contained">
//               Add
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add Tag Dialog */}
//         <Dialog open={openTagDialog} onClose={() => setOpenTagDialog(false)}>
//           <DialogTitle>Add Tags</DialogTitle>
//           <DialogContent>
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Select Tags</InputLabel>
//               <Select
//                 multiple
//                 value={selectedTags}
//                 onChange={(e) => setSelectedTags(e.target.value)}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {selected.map((value) => (
//                       <Chip key={value} label={value} />
//                     ))}
//                   </Box>
//                 )}
//               >
//                 {tags.map((tag) => (
//                   <MenuItem key={tag._id} value={tag._id}>
//                     {tag._id} ({tag.count})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               margin="dense"
//               label="New Tag"
//               fullWidth
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && newTag.trim()) {
//                   setSelectedTags([...selectedTags, newTag.trim()]);
//                   setNewTag('');
//                 }
//               }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenTagDialog(false)}>Cancel</Button>
//             <Button onClick={handleAddTags} variant="contained">
//               Add Tags
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default LeadDetail;











import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Autocomplete
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Source as SourceIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Label as LabelIcon,
  Note as NoteIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  LocalOffer as LocalOfferIcon,
  Send as SendIcon,
  Call as CallIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { leadAPI, userAPI, tagAPI, noteAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openTagDialog, setOpenTagDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState({ open: false, type: '', text: '' });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchLead();
    fetchAgents();
    fetchTags();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      // Use the correct API endpoint - assuming your API has a getLead endpoint
      const response = await leadAPI.getLead?.(id) || await leadAPI.getLeads({ _id: id });
      
      // Handle different response structures
      let leadData;
      if (response.data.lead) {
        leadData = response.data.lead;
      } else if (response.data.leads && response.data.leads.length > 0) {
        leadData = response.data.leads[0];
      } else if (response.data) {
        leadData = response.data;
      }
      
      if (leadData) {
        setLead(leadData);
        setEditData({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          source: leadData.source,
          status: leadData.status
        });
      } else {
        setMessage({
          open: true,
          type: 'error',
          text: 'Lead not found'
        });
      }
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error fetching lead details'
      });
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await userAPI.getUsers({ role: 'support_agent' });
      setAgents(response.data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getAllTags();
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await leadAPI.updateLead(id, { status: newStatus });
      setLead(prev => ({ ...prev, status: newStatus }));
      setMessage({
        open: true,
        type: 'success',
        text: 'Status updated successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error updating status'
      });
      console.error('Error updating status:', error);
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      const agent = agents.find(a => a._id === agentId);
      await leadAPI.updateLead(id, { assignedTo: agentId });
      setLead(prev => ({
        ...prev,
        assignedTo: agent || null
      }));
      setMessage({
        open: true,
        type: 'success',
        text: 'Agent assigned successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error assigning agent'
      });
      console.error('Error assigning agent:', error);
    }
  };

  const handleUpdateLead = async () => {
    try {
      await leadAPI.updateLead(id, editData);
      setLead(prev => ({ ...prev, ...editData }));
      setEditMode(false);
      setMessage({
        open: true,
        type: 'success',
        text: 'Lead updated successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error updating lead'
      });
      console.error('Error updating lead:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Note cannot be empty'
      });
      return;
    }
    
    try {
      const noteData = {
        content: newNote.trim(),
        createdBy: user._id
      };
      
      // Add note using the API
      const response = await noteAPI.addNote?.(id, noteData);
      
      if (response?.data?.notes) {
        setLead(prev => ({
          ...prev,
          notes: response.data.notes
        }));
      } else {
        // Fallback: manually add note to local state
        const newNoteObj = {
          _id: Date.now().toString(),
          content: newNote.trim(),
          createdBy: user,
          createdAt: new Date().toISOString()
        };
        setLead(prev => ({
          ...prev,
          notes: [...(prev.notes || []), newNoteObj]
        }));
      }
      
      setNewNote('');
      setOpenNoteDialog(false);
      setMessage({
        open: true,
        type: 'success',
        text: 'Note added successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error adding note'
      });
      console.error('Error adding note:', error);
    }
  };

  const handleAddTags = async () => {
    if (selectedTags.length === 0 && !newTag.trim()) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Please add at least one tag'
      });
      return;
    }
    
    try {
      const tagsToAdd = [...selectedTags];
      if (newTag.trim()) {
        tagsToAdd.push(newTag.trim());
      }
      
      await tagAPI.updateLeadTags(id, { 
        tags: tagsToAdd, 
        action: 'add' 
      });
      
      // Update local state
      setLead(prev => ({
        ...prev,
        tags: [...new Set([...(prev.tags || []), ...tagsToAdd])]
      }));
      
      setSelectedTags([]);
      setNewTag('');
      setOpenTagDialog(false);
      setMessage({
        open: true,
        type: 'success',
        text: 'Tags added successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error adding tags'
      });
      console.error('Error adding tags:', error);
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      await tagAPI.updateLeadTags(id, { 
        tags: [tag], 
        action: 'remove' 
      });
      
      // Update local state
      setLead(prev => ({
        ...prev,
        tags: (prev.tags || []).filter(t => t !== tag)
      }));
      
      setMessage({
        open: true,
        type: 'success',
        text: 'Tag removed successfully'
      });
    } catch (error) {
      setMessage({
        open: true,
        type: 'error',
        text: 'Error removing tag'
      });
      console.error('Error removing tag:', error);
    }
  };

  const handleDeleteLead = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.deleteLead(id);
        navigate('/leads');
        setMessage({
          open: true,
          type: 'success',
          text: 'Lead deleted successfully'
        });
      } catch (error) {
        setMessage({
          open: true,
          type: 'error',
          text: 'Error deleting lead'
        });
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleCloseMessage = () => {
    setMessage({ ...message, open: false });
  };

  const handleEditFieldChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Lead Not Found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/leads')}
        >
          Back to Leads
        </Button>
      </Box>
    );
  }

  const statusColors = {
    new: 'default',
    contacted: 'primary',
    qualified: 'warning',
    lost: 'error',
    won: 'success'
  };

  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    lost: 'Lost',
    won: 'Won'
  };

  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    social_media: 'Social Media',
    cold_call: 'Cold Call',
    event: 'Event',
    other: 'Other'
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Alert Message */}
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>

      {/* Header with Back Button */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Tooltip title="Back to leads">
          <IconButton onClick={() => navigate('/leads')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" fontWeight="600">
          Lead Details
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1}>
          {user.role !== 'support_agent' && (
            <Tooltip title="Edit lead">
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel Edit' : 'Edit'}
              </Button>
            </Tooltip>
          )}
          {user.role !== 'support_agent' && (
            <Tooltip title="Delete lead">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteLead}
              >
                Delete
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Lead Information - Main Content */}
        <Grid item xs={12} md={8}>
          {/* Lead Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Lead Status */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Lead Status</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {Object.keys(statusLabels).map((status) => (
                      <Chip
                        key={status}
                        label={statusLabels[status]}
                        color={statusColors[status]}
                        variant={lead.status === status ? 'filled' : 'outlined'}
                        onClick={() => handleUpdateStatus(status)}
                        icon={lead.status === status ? <WorkIcon /> : undefined}
                        sx={{
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          minWidth: 100
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <PersonIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Name
                          </Typography>
                          {editMode ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={editData.name}
                              onChange={(e) => handleEditFieldChange('name', e.target.value)}
                            />
                          ) : (
                            <Typography variant="body1">{lead.name}</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <EmailIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Email
                          </Typography>
                          {editMode ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={editData.email}
                              onChange={(e) => handleEditFieldChange('email', e.target.value)}
                            />
                          ) : (
                            <Typography variant="body1">{lead.email}</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <PhoneIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Phone
                          </Typography>
                          {editMode ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={editData.phone}
                              onChange={(e) => handleEditFieldChange('phone', e.target.value)}
                            />
                          ) : (
                            <Typography variant="body1">{lead.phone}</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <SourceIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Source
                          </Typography>
                          {editMode ? (
                            <FormControl fullWidth size="small">
                              <Select
                                value={editData.source}
                                onChange={(e) => handleEditFieldChange('source', e.target.value)}
                              >
                                {Object.entries(sourceLabels).map(([value, label]) => (
                                  <MenuItem key={value} value={value}>
                                    {label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography variant="body1" textTransform="capitalize">
                              {sourceLabels[lead.source] || lead.source}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Tags Section */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">Tags</Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenTagDialog(true)}
                    >
                      Add Tags
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {lead.tags && lead.tags.length > 0 ? (
                      lead.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          deleteIcon={<LocalOfferIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No tags added yet
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  <NoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNoteDialog(true)}
                >
                  Add Note
                </Button>
              </Stack>

              {lead.notes && lead.notes.length > 0 ? (
                <List>
                  {lead.notes.map((note, index) => (
                    <React.Fragment key={note._id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {note.createdBy?.name?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1">
                              {note.content}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ fontWeight: 500 }}
                              >
                                {note.createdBy?.name || 'Unknown User'}
                              </Typography>
                              {` • ${formatDate(note.createdAt)}`}
                            </>
                          }
                        />
                      </ListItem>
                      {index < lead.notes.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NoteIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No notes yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Add your first note to track conversations and updates
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Assignment Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Assignment
              </Typography>
              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel>Assign to Agent</InputLabel>
                <Select
                  value={lead.assignedTo?._id || ''}
                  label="Assign to Agent"
                  onChange={(e) => handleAssignAgent(e.target.value)}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent._id} value={agent._id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {agent.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{agent.name}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {lead.assignedTo && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {lead.assignedTo.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{lead.assignedTo.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {lead.assignedTo.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Timeline
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(lead.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(lead.updatedAt)}
                  />
                </ListItem>
                {lead.assignedAt && (
                  <ListItem>
                    <ListItemText
                      primary="Assigned"
                      secondary={formatDate(lead.assignedAt)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={() => window.location.href = `mailto:${lead.email}`}
                >
                  Send Email
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CallIcon />}
                  onClick={() => window.location.href = `tel:${lead.phone}`}
                >
                  Call Lead
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  onClick={() => {
                    // Navigate to create follow-up task or reminder
                  }}
                >
                  Schedule Follow-up
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Edit Button (floating) */}
      {editMode && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<EditIcon />}
            onClick={handleUpdateLead}
            sx={{
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            Save Changes
          </Button>
        </Box>
      )}

      {/* Add Note Dialog */}
      <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained">
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={openTagDialog} onClose={() => setOpenTagDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Tags</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            freeSolo
            options={tags.map(tag => tag._id)}
            value={selectedTags}
            onChange={(event, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select or create tags"
                placeholder="Type to add tags..."
                sx={{ mt: 2 }}
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
          <TextField
            margin="normal"
            label="Create New Tag"
            fullWidth
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTag.trim()) {
                setSelectedTags([...selectedTags, newTag.trim()]);
                setNewTag('');
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTagDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTags} variant="contained">
            Add Tags
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Snackbar Component
const Snackbar = ({ open, autoHideDuration, onClose, anchorOrigin, children }) => {
  return open ? (
    <Box
      sx={{
        position: 'fixed',
        top: anchorOrigin?.vertical === 'top' ? 20 : 'auto',
        bottom: anchorOrigin?.vertical === 'bottom' ? 20 : 'auto',
        right: anchorOrigin?.horizontal === 'right' ? 20 : 'auto',
        left: anchorOrigin?.horizontal === 'left' ? 20 : 'auto',
        zIndex: 9999
      }}
    >
      {children}
    </Box>
  ) : null;
};

export default LeadDetail;