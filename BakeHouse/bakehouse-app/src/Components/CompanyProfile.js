import React, { Component } from 'react';
import './BakeHouse.css';

class CompanyProfile extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const { currentDateTime } = this.props;
    return (
      <div className="company-info">
        <p><h3><b>The BakeHouse Company</b></h3></p>
        <p>Rushden NN10 6FH, England.</p>
        <p>+44 1933 99999</p>
        <p><h5>
            Print Date: {currentDateTime}
            </h5>
        </p><hr/>
        <br/>
        <p><i>Thank you for your business!</i></p>
      </div>

    );
  }
}

export default CompanyProfile;