// src/App.js
import React, { useEffect, useState } from "react";
import MidiControl from "./components/MidiControl";
import "./App.css";

const MAX_CONTROLS = 16;

function App() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiOut, setMidiOut] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [isConfigMode, setIsConfigMode] = useState(false); // New state for configuration mode

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (access) => {
          setMidiAccess(access);
          const outputs = Array.from(access.outputs.values());
          if (outputs.length > 0) {
            setMidiOut(outputs[0]);
          } else {
            console.error("No MIDI output devices available.");
          }
        },
        () => {
          console.error("Could not access your MIDI devices.");
        }
      );
    } else {
      console.error("WebMIDI is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    const loadDefaultConfig = async () => {
      try {
        const response = await fetch('/configurations/default-config.json');
        if (!response.ok) throw new Error('Failed to load default configuration JSON.');
        const config = await response.json();
        setSliders(config.filter(c => c.type === 'slider'));
        setButtons(config.filter(c => c.type === 'button'));
      } catch (error) {
        console.error("Error loading default configuration:", error);
      }
    };
    loadDefaultConfig();
  }, []);

  const handleConfigChange = (type, index, newConfig) => {
    if (type === 'slider') {
      const updatedSliders = [...sliders];
      updatedSliders[index] = newConfig;
      setSliders(updatedSliders);
    } else if (type === 'button') {
      const updatedButtons = [...buttons];
      updatedButtons[index] = newConfig;
      setButtons(updatedButtons);
    }
  };

  const addControl = (type) => {
    const index = (type === 'slider' ? sliders.length : buttons.length) + 1;
    const newControl = { type, defaultCcNumber: 0, tag: `${type}${index}` };
    if (type === 'slider' && sliders.length < MAX_CONTROLS) {
      setSliders([...sliders, newControl]);
    } else if (type === 'button' && buttons.length < MAX_CONTROLS) {
      setButtons([...buttons, newControl]);
    }
  };

  const removeControl = (type, index) => {
    if (type === 'slider') {
      setSliders(sliders.filter((_, i) => i !== index));
    } else if (type === 'button') {
      setButtons(buttons.filter((_, i) => i !== index));
    }
  };

  const saveConfiguration = () => {
    const config = [...sliders, ...buttons];
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'midi-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadConfiguration = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const loadedConfig = JSON.parse(e.target.result);
          setSliders(loadedConfig.filter(c => c.type === 'slider'));
          setButtons(loadedConfig.filter(c => c.type === 'button'));
        } catch (error) {
          alert("Failed to load configuration. Invalid JSON format.");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <div className="navbar">
        <button onClick={() => setIsConfigMode(!isConfigMode)}>
          {isConfigMode ? "Exit Configuration" : "Configuration"}
        </button>
        <button onClick={saveConfiguration}>Save</button>
        <input type="file" onChange={loadConfiguration} />
        <button className="load-config" onClick={() => document.querySelector('input[type="file"]').click()}>
          Load Configuration
        </button>
      </div>
      <div className="controls-container">
        <div className="controls-slider-container">
          {sliders.map((control, index) => (
            <div key={index} className="control-wrapper">
              <MidiControl
                type={control.type}
                defaultCcNumber={control.defaultCcNumber}
                tag={control.tag}
                midiOut={midiOut}
                onConfigChange={(newConfig) => handleConfigChange('slider', index, newConfig)}
                isConfigMode={isConfigMode} // Pass config mode state to MidiControl
              />
              {isConfigMode && (
                <div className="control-details">
                  <button className="close" onClick={() => removeControl('slider', index)}>×</button>
                </div>
              )}
            </div>
          ))}
          {isConfigMode && sliders.length < MAX_CONTROLS && (
            <button className="add-control" onClick={() => addControl('slider')}>+ Add Slider</button>
          )}
        </div>
        <div className="controls-button-container">
          {buttons.map((control, index) => (
            <div key={index} className="control-wrapper">
              <MidiControl
                type={control.type}
                defaultCcNumber={control.defaultCcNumber}
                tag={control.tag}
                midiOut={midiOut}
                onConfigChange={(newConfig) => handleConfigChange('button', index, newConfig)}
                isConfigMode={isConfigMode} // Pass config mode state to MidiControl
              />
              {isConfigMode && (
                <div className="control-details">
                  <button className="close" onClick={() => removeControl('button', index)}>×</button>
                </div>
              )}
            </div>
          ))}
          {isConfigMode && buttons.length < MAX_CONTROLS && (
            <button className="add-control" onClick={() => addControl('button')}>+ Add Button</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
