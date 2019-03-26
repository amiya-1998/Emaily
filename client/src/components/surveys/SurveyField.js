import React from 'react';

const SurveyField = ({ id, input, placeholder, meta: { error, touched } }) => {
  return (
    <div>
      <input
        {...input}
        id={id}
        style={{ marginBottom: '5px' }}
        placeholder={placeholder}
      />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};

export default SurveyField;
