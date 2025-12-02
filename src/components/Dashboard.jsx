// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from '@mui/material';
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { dashboardAPI } from '../services/api';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await dashboardAPI.getStats();
//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const statusColors = {
//     new: '#8884d8',
//     contacted: '#82ca9d',
//     qualified: '#ffc658',
//     lost: '#ff8042',
//     won: '#00C49F'
//   };

//   if (!stats) return <div>Loading...</div>;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      
//       <Grid container spacing={3}>
//         {/* Overview Cards */}
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="textSecondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.totalLeads}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Lead Status Distribution */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2, height: 400 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Lead Status Distribution</Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <PieChart>
//                 <Pie
//                   data={stats.statusDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                 >
//                   {stats.statusDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={statusColors[entry._id] || '#8884d8'} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Monthly Growth */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2, height: 400 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Monthly Lead Growth</Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <BarChart data={stats.monthlyGrowth}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="_id" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Agent Performance */}
//         {stats.agentPerformance.length > 0 && (
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Agent Performance</Typography>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Agent</TableCell>
//                       <TableCell align="right">Total Leads</TableCell>
//                       <TableCell align="right">Won</TableCell>
//                       <TableCell align="right">Conversion Rate</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {stats.agentPerformance.map((agent, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{agent.agent}</TableCell>
//                         <TableCell align="right">{agent.total}</TableCell>
//                         <TableCell align="right">{agent.won}</TableCell>
//                         <TableCell align="right">
//                           {agent.conversionRate.toFixed(2)}%
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         )}

//         {/* Recent Activities */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Recent Activities</Typography>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>User</TableCell>
//                     <TableCell>Action</TableCell>
//                     <TableCell>Entity</TableCell>
//                     <TableCell>Details</TableCell>
//                     <TableCell>Time</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {stats.recentActivities.map((activity, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{activity.user?.name}</TableCell>
//                       <TableCell>{activity.action}</TableCell>
//                       <TableCell>{activity.entity}</TableCell>
//                       <TableCell>
//                         {JSON.stringify(activity.details).slice(0, 50)}...
//                       </TableCell>
//                       <TableCell>
//                         {new Date(activity.timestamp).toLocaleString()}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;