import React from 'react';
import { connect } from 'react-redux';
import { submitSurvey } from '../../actions/index';
import { withRouter } from 'react-router-dom';

import FIELDS from './surveyFields';

function SurveyFormReview({ onCancel, formValues, submitSurvey, history }) {
  return (
    <div>
      <h5>Please Confirm Your entries</h5>
      {FIELDS.map(({ name, placeholder }) => (
        <div key={name}>
          <label>{placeholder}</label>
          <div>{formValues[name]}</div>
        </div>
      ))}

      <button
        className="yellow darken-3 btn-flat white-text"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        className="green btn-flat right white-text"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey <i className="material-icons right">email</i>
      </button>
    </div>
  );
}

const mapStateToProps = state => ({
  formValues: state.form.surveyForm.values
});

export default connect(
  mapStateToProps,
  { submitSurvey }
)(withRouter(SurveyFormReview));
