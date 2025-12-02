import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Typography,
  TextField,
  Chip,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { leadAPI, tagAPI } from '../services/api';

const ExportLeads = ({ open, onClose, filters }) => {
  const [exportFields, setExportFields] = useState([
    { id: 'name', label: 'Name', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'phone', label: 'Phone', checked: true },
    { id: 'source', label: 'Source', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'tags', label: 'Tags', checked: true },
    { id: 'assignedTo.name', label: 'Assigned Agent', checked: true },
    { id: 'createdAt', label: 'Created Date', checked: true },
    { id: 'updatedAt', label: 'Updated Date', checked: false },
    { id: 'notes', label: 'Notes', checked: false }
  ]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getAllTags();
      setAvailableTags(response.data.map(tag => tag._id));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleFieldToggle = (fieldId) => {
    setExportFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, checked: !field.checked } : field
      )
    );
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const selectedFieldIds = exportFields
        .filter(field => field.checked)
        .map(field => field.id);
      
      const params = {
        fields: selectedFieldIds.join(','),
        ...filters
      };

      if (dateRange.startDate) {
        params.startDate = dateRange.startDate.toISOString();
      }
      if (dateRange.endDate) {
        params.endDate = dateRange.endDate.toISOString();
      }
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }

      const response = await leadAPI.exportLeads(params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Export Leads</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Select Fields to Export
          </Typography>
          
          <FormGroup sx={{ mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {exportFields.map((field) => (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox
                      checked={field.checked}
                      onChange={() => handleFieldToggle(field.id)}
                    />
                  }
                  label={field.label}
                />
              ))}
            </Box>
          </FormGroup>

          <Typography variant="subtitle1" gutterBottom>
            Filter by Date Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, startDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
            />
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, endDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
            />
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Filter by Tags
          </Typography>
          <Autocomplete
            multiple
            options={availableTags}
            value={selectedTags}
            onChange={(event, newValue) => setSelectedTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Tags" size="small" />
            )}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ExportLeads;