import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import SurveyField from './SurveyField';

import FIELDS from './surveyFields';

class SurveyForm extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {FIELDS.map(({ id, placeholder, name }) => (
            <Field
              component={SurveyField}
              type="text"
              placeholder={placeholder}
              name={name}
              key={name}
              id={id}
            />
          ))}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  FIELDS.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide ${name} to submit`;
    }
  });

  return errors;
};

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);
