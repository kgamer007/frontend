import React from 'react';
import PropTypes from 'prop-types';//eslint-disable-line
import * as routes from '../../lib/routes';//eslint-disable-line

import './connection-modal.scss';

export default class ConnectionModal extends React.Component {
  render() {
    return (
      <div className="modalContainer">
        <form className="modal">
          <button className="close-modal">x</button>
          <h1>Add A Connection</h1>
          <div className="field-wrap dropdown">
            <label htmlFor="student">Student Name:</label>
              <select type="student" required>
              </select>
          </div>
          <div className="field-wrap dropdown">
            <label htmlFor="role">Role Of Connection:</label>
              <select type="role" required>
                <option value="mentor">Mentor</option>
                <option value="teacher">Teacher</option>
                <option value="coach">Coach</option>
              </select>
          </div>
          <div className="field-wrap dropdown">
            <label htmlFor="connection-name">Name Of Connection:</label>
              <select type="connection-name" required>
              </select>
          </div>
        <div className="addButton-container">
          <button type="submit" className="addButton">Add Person</button>
        </div>
        </form>
      </div>
    );
  }
}
