// Cart.js
import React, { Component } from 'react';
import './BakeHouse.css';
import {
  TextField,
  Stack,
  PrimaryButton,
  Label,
  ChoiceGroup,
} from '@fluentui/react';

export default class ShoppingCart extends Component {
  // Implement your cart rendering logic here
  // ...
  // handleRemoveFromCart = (index) => {
  //   this.setState((prevState) => {
  //     const updatedCartItems = [...prevState.cartItems];
  //     updatedCartItems.splice(index, 1);
  //     return { cartItems: updatedCartItems };
  //   });
  // };
  constructor(props) {
    super(props);
    this.state = {
      customer: {
        customerName: '', // Initialize with appropriate properties
        customerAddress: '',
        customerContact: '',
        customerRemarks: '',
        paymentMode: '',
      },
    };
  }
 
  
  handleCheckoutClick = () => {
    const { onCheckOut, customer } = this.props;
//     alert(customer.customerRemarks);
//     //
//     // Prepare the data you want to pass back to the parent component
//     const customerData = {
//       customerName: 'DOne',
//       customerAddress: 'DOne',
//       customerContact: 'DOne',
//       customerRemarks: 'DOne',
//       paymentMode: 'DOne',
//     };
// debugger
    // Invoke the callback function to send the data back to the parent
    onCheckOut(this.state.customer);
 };

 handleInputChange = (event, newValue) => {
  const { name, value } = event.target;
  this.setState((prevState) => ({
    customer: {
      ...prevState.customer,
      [name]: value,
    },
  }));
};

// Define the handlePaymentModeChange function
handlePaymentModeChange = (ev, option) => {
  // Update the paymentMode field with the selected key (payment mode)
  const updatedCustomer = { ...this.state.customer };
  updatedCustomer.paymentMode = option.key;

  // Update the component state with the updated customer object
  this.setState({
    customer: updatedCustomer,
  });
};



  render() {
    let { deliveryCharges, cartItems, onRemoveFromCart, onCheckOut, customer } = this.props;

    if (!cartItems) {
        return ;
    }

    const totalBill = cartItems.reduce(
      (total, item) => total + (item.numUnitPrice - item.numDiscount) * item.defaultUnit,
      0
    );

    const roundedTotalBill = totalBill.toFixed(2);
    const totalAmountBill = (parseFloat(roundedTotalBill) + parseFloat(deliveryCharges)).toFixed(2);

    return (
      <div className="cart">

        <h1>INVOICE</h1>
       
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Discount (%)</th>
              <th>Price ($)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.numItemID}>
                <td className='bakeditem-itemName'><b>{item.varItemName}</b></td>
                <td>${item.numUnitPrice}</td>
                <td>{item.defaultUnit}</td>
                <td>{item.numDiscount}</td>
                <td>${((item.numUnitPrice - item.numDiscount) * item.defaultUnit).toFixed(2)}</td> {/* Total after discount */}
                <td>
                  <button onClick={() => onRemoveFromCart(index)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr></hr>
        <div className='order-info'>
          <p className='middle-title'><b>Subtotal: ${roundedTotalBill}</b></p> {/* Display total bill */}
          <p className='sub-title'><b>Delivery Charges: ${deliveryCharges}</b></p>
          <p className='sub-title'><b>Tax (0%): ${0.00}</b></p><hr></hr>
          <p className='main-title'><b>Total: ${totalAmountBill}</b></p>
        </div>
        <div>
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={customer.customerName}
              onChange={this.handleInputChange}
              required
            />
            <TextField
              label="Customer Address"
              name="customerAddress"
              value={customer.customerAddress}
              onChange={this.handleInputChange}
              required
            />
            <TextField
              label="Customer Contact"
              name="customerContact"
              value={customer.customerContact}
              onChange={this.handleInputChange}
              required
            />
            <TextField
              label="Remarks"
              name="customerRemarks"
              value={customer.customerRemarks}
              onChange={this.handleInputChange}
              multiline
              autoAdjustHeight
            />
            <Label>Payment Mode:</Label>
            <div className='choiceGroup'>
            <ChoiceGroup
              selectedKey={customer.paymentMode}
              options={[
                { key: 'Card', text: 'Card' },
                { key: 'Cash', text: 'Cash' },
                // Add more payment modes as needed
              ]}
              onChange={this.handlePaymentModeChange}
              required
            />
            </div>
          </Stack>
        </div>
        <br/><br/><hr></hr>
        <button className='onCheckOutButton' onClick={() => this.handleCheckoutClick()} >Check Out</button>
      </div>
    );
  }
}
