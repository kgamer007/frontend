import React from 'react';
import './buttons.scss';

class DeleteAndSave extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="btnGroup">
          <button className="deleteBtn">Delete</button>
          <button className="updateBtn">Save</button>
        </div>
      </React.Fragment>
    );
  }
}

export default DeleteAndSave;
