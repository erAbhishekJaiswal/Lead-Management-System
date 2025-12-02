// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   Alert,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton
// } from '@mui/material';
// import {
//   CloudUpload as UploadIcon,
//   Delete as DeleteIcon,
//   Download as DownloadIcon
// } from '@mui/icons-material';
// import { leadAPI } from '../services/api';

// const ImportLeads = ({ open, onClose, onSuccess }) => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [errors, setErrors] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       // Check file type
//       if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
//         alert('Please select an Excel file (.xlsx or .xls)');
//         return;
//       }
//       setFile(selectedFile);
//       setResult(null);
//       setErrors([]);
//     }
//   };

//   const handleImport = async () => {
//     if (!file) return;

//     setLoading(true);
//     try {
//       const response = await leadAPI.importLeads(file);
//       setResult(response.data);
      
//       if (response.data.errors && response.data.errors.length > 0) {
//         setErrors(response.data.errors);
//       } else {
//         onSuccess?.();
//         setTimeout(() => {
//           onClose();
//           setFile(null);
//           setResult(null);
//           setErrors([]);
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Import error:', error);
//       setResult({
//         imported: 0,
//         failed: 0,
//         errors: [error.response?.data?.error || 'Import failed']
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadTemplate = () => {
//     // Create template data
//     const template = [
//       {
//         Name: 'John Doe',
//         Email: 'john@example.com',
//         Phone: '+1234567890',
//         Source: 'website',
//         Status: 'new',
//         Tags: 'premium,enterprise'
//       }
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(template);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
//     XLSX.writeFile(workbook, 'leads_import_template.xlsx');
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Import Leads</DialogTitle>
//       <DialogContent>
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="body2" color="textSecondary" paragraph>
//             Upload an Excel file with the following columns:
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Name (required)
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Email (required)
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Phone (required)
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Source (optional: website, referral, social_media, cold_call, event, other)
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Status (optional: new, contacted, qualified, lost, won)
//           </Typography>
//           <Typography variant="caption" component="div">
//             • Tags (optional, comma-separated)
//           </Typography>
//         </Box>

//         <Button
//           variant="outlined"
//           startIcon={<DownloadIcon />}
//           onClick={downloadTemplate}
//           sx={{ mb: 2 }}
//         >
//           Download Template
//         </Button>

//         <Box
//           sx={{
//             border: '2px dashed #ccc',
//             borderRadius: 1,
//             p: 4,
//             textAlign: 'center',
//             mb: 2
//           }}
//         >
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFileChange}
//             style={{ display: 'none' }}
//             id="file-upload"
//           />
//           <label htmlFor="file-upload">
//             <Button
//               component="span"
//               variant="contained"
//               startIcon={<UploadIcon />}
//             >
//               Choose File
//             </Button>
//           </label>
//           {file && (
//             <Box sx={{ mt: 2 }}>
//               <Typography>{file.name}</Typography>
//               <IconButton
//                 size="small"
//                 onClick={() => setFile(null)}
//                 color="error"
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           )}
//         </Box>

//         {loading && <LinearProgress sx={{ mb: 2 }} />}

//         {result && (
//           <Alert 
//             severity={result.failed === 0 ? "success" : "warning"}
//             sx={{ mb: 2 }}
//           >
//             Imported {result.imported} leads. {result.failed > 0 && `Failed: ${result.failed}`}
//           </Alert>
//         )}

//         {errors.length > 0 && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle2" color="error" gutterBottom>
//               Errors:
//             </Typography>
//             <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
//               {errors.map((error, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={error} />
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           onClick={handleImport}
//           variant="contained"
//           disabled={!file || loading}
//         >
//           {loading ? 'Importing...' : 'Import'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ImportLeads;