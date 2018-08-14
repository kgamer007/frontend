import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Iframe from '../iframe/iframe';
// import PointTrackerForm from '../point-tracker-form/point-tracker-form';

import './_dashboard.scss';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
});

class Dashboard extends React.Component {
  renderJSX = (loggedIn) => {
    // <PointTrackerForm />
    const iframe = (
      <React.Fragment>
        <Iframe />
      </React.Fragment>
    );

    const dashboard = (
      <div className="main">
      </div>
    );
    return loggedIn ? dashboard : iframe;
  };

  render() {
    return (
      <React.Fragment>
        {
          this.renderJSX(this.props.loggedIn)
        }
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  loggedIn: PropTypes.bool,
};

export default connect(mapStateToProps, null)(Dashboard);