// src/components/EditPopup.js
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const EditPopup = ({ currentTag, currentCcNumber, currentType, onSave, onClose }) => {
  const [tag, setTag] = useState(currentTag);
  const [ccNumber, setCcNumber] = useState(currentCcNumber);
  const [type, setType] = useState(currentType);

  const handleSave = () => {
    onSave({ tag, ccNumber, type });
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Control</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tag"
          fullWidth
          variant="outlined"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <TextField
          margin="dense"
          label="CC Number"
          type="number"
          fullWidth
          variant="outlined"
          value={ccNumber}
          onChange={(e) => setCcNumber(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Type"
          fullWidth
          variant="outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPopup;
