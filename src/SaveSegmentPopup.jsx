import React, { useState } from 'react';
import './SaveSegmentPopup.css';


const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

const SaveSegmentPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);

  const handleAddSchema = (schema) => {
    setSelectedSchemas([...selectedSchemas, schema]);
    setAvailableSchemas(availableSchemas.filter(s => s.value !== schema.value));
  };

  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };
    // Replace 'your-webhook-url' with the actual URL provided by webhook.site
    fetch('https://webhook.site/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setShowPopup(false);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <button className='click' onClick={() => setShowPopup(true)}>Save segment</button>
      {showPopup && (
        <div className="popup">
          <h2>Saving Segment</h2>
          <input
            type="text"
            placeholder="Name of the segment"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          <select
            value=""
            onChange={(e) => handleAddSchema(schemaOptions.find(s => s.value === e.target.value))}
          >
            <option value="">Add schema to segment</option>
            {availableSchemas.map(schema => (
              <option key={schema.value} value={schema.value}>{schema.label}</option>
            ))}
          </select>
          <button onClick={() => setAvailableSchemas(schemaOptions)}>+Add new schema</button>
          <div className="selected-schemas">
            {selectedSchemas.map(schema => (
              <div key={schema.value}>{schema.label}</div>
            ))}
          </div>
          <button onClick={handleSaveSegment}>Save The Segment</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SaveSegmentPopup;
