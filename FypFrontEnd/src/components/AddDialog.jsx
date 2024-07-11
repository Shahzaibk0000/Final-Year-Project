import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import PropTypes from 'prop-types';

function AddDialog({ open, onClose, title, fields, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h3">{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid key={field.name} item xs={field.size || 6}>
              <TextField
                autoFocus={field.autoFocus}
                margin="dense"
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      autoFocus: PropTypes.bool,
      size: PropTypes.number,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddDialog;