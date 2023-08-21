import React, { Component } from 'react';
import Header from './Header';
import CompanyProfile from './CompanyProfile';
import './BakeHouse.css';

class Invoice extends Component {

 
  // Helper function to convert numerical rating to stars
//   renderStars(numUserRating) {
    
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span key={i} className={`star ${i <= numUserRating ? 'filled' : ''}`}>
//           &#9733;
//         </span>
//       );
//     }
//     return stars;
//   }

render() {
    const { invoiceItems, currentDateTime } = this.props;
  
    // Check if invoiceItems is defined and not empty before mapping
    if (!invoiceItems || invoiceItems.length === 0) {
      return <div></div>;
    }
  
    return (
      <div>
      <Header/>
      <h1 className='invoice-title'>BILLING INVOICE</h1>
      <CompanyProfile currentDateTime = {currentDateTime}/>
      
      <table className="invoice">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Contact</th>
            <th>Remarks</th>
            <th>Payment Mode</th>
            <th>Amount ($)</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <tr key={index}>
              <td><b>{item.numInvoice}</b></td>
              <td>{item.varCustomerName}</td>
              <td>{item.varCustomerAddress}</td>
              <td>{item.varCustomerContact}</td>
              <td>{item.varRemarks}</td>
              <td>{item.varPaymentMode}</td>
              <td>{item.numInvoiceAmount}</td>
              <td>{item.dtCreatedOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }
}

export default Invoice;