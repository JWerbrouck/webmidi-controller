// src/components/MidiControl.js
import React, { useState } from "react";
import { Slider, Button } from "@mui/material";
import EditPopup from "./EditPopup";

const MidiControl = ({ type, defaultCcNumber, tag, midiOut, onConfigChange, isConfigMode }) => {
  const [ccValue, setCcValue] = useState(type === "slider" ? 64 : 0);
  const [ccNumber, setCcNumber] = useState(defaultCcNumber);
  const [controlType, setControlType] = useState(type);
  const [controlTag, setControlTag] = useState(tag);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const sendMidiCC = (ccNumber, value) => {
    if (midiOut) {
      const channel = 0;
      const statusByte = 0xB0 | channel;
      const ccMessage = [statusByte, ccNumber, value];
      midiOut.send(ccMessage);
    } else {
      console.error("No MIDI output device available.");
    }
  };

  const handleSliderChange = (event, newValue) => {
    setCcValue(newValue);
    sendMidiCC(ccNumber, newValue);
  };

  const handleButtonClick = () => {
    const newValue = ccValue === 0 ? 127 : 0;
    setCcValue(newValue);
    sendMidiCC(ccNumber, newValue);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isConfigMode) {
      setShowEditPopup(true);
    }
  };

  const handleSaveConfig = (newConfig) => {
    setControlTag(newConfig.tag);
    setCcNumber(newConfig.ccNumber);
    setControlType(newConfig.type);
    onConfigChange({
      type: newConfig.type,
      defaultCcNumber: newConfig.ccNumber,
      tag: newConfig.tag,
    });
    setShowEditPopup(false);
  };

  return (
    <div className="midi-control" onContextMenu={handleContextMenu}>
      {controlType === "slider" ? (
        <Slider
          orientation="vertical"
          value={ccValue}
          min={0}
          max={127}
          onChange={handleSliderChange}
          sx={{ width: 5, height: 200 }}
        />
      ) : (
        <Button variant={ccValue === 0 ? "outlined" : "contained"} onClick={handleButtonClick}>
          {ccValue === 0 ? "Off" : "On"}
        </Button>
      )}
      <p>{controlTag}</p>
      {showEditPopup && isConfigMode && (
        <EditPopup
          currentTag={controlTag}
          currentCcNumber={ccNumber}
          currentType={controlType}
          onSave={handleSaveConfig}
          onClose={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
};

export default MidiControl;
