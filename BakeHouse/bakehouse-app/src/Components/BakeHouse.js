import React, { Component } from 'react';
import BakedHouseService from './BakedHouseService';
import './BakeHouse.css';
import ShoppingCart from './ShoppingCart';
import Invoice from './Invoice';
import Header from './Header';
import {
  Button,
  TextField
} from '@fluentui/react';


class BakeHouse extends Component {
    constructor(props) {
        super(props);
       // this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    
        this.state = {
          searchQuery: '',
          currentDateTime: new Date().toLocaleString(),
          roundedTotalBill: 0,
          deliveryCharges: 3.00,
          loading: true,
          isPopupOpen: false,
          allbakedItems: [],
          bakedItems: [],
          cartItems: [],
          invoiceItems: [],
          customer: [{
            customerName: '',
            customerAddress: '',
            customerContact: '',
            customerRemarks: '',
            paymentMode: ''
          }]
        };
      }

      componentDidMount() {
        
        this.GetBakedItems();
        this.GetBakeHouseInvoices();
      }

      handleSearchChange = (e) => {
        debugger
        if(e.target.value){

          let filteredbakedItems = this.state.allbakedItems.filter(items => items.varItemName.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
          this.setState({
            "searchQuery":  e.target.value,
            "bakedItems": filteredbakedItems
          })
        }
        else {
          this.setState({
            "searchQuery":  e.target.value,
            "bakedItems": this.state.allbakedItems
          })
        }
      }
    

      togglePopup = () => {
        this.setState((prevState) => ({
          isPopupOpen: !prevState.isPopupOpen,
        }));
      };

  


      GetBakeHouseInvoices= async () =>{
        debugger
        await BakedHouseService.getBakeHouseInvoices()
          .then((response) => {
            // Destructure the 'data' property from the response
            const { data } = response;

            this.setState({
              invoiceItems: data
            }); 
          })
          .catch((error) => {
            console.error('Error:', error);
          });   
      }

      GetBakedItems= async () =>{

          // Fetch bakedItems data from your API
          await BakedHouseService.getBakedItems()
        .then((response) => {
          const bakedItemsWithImages = response.data.map((item) => ({
            ...item,
            varItemPath: require(`../Images${item.varItemPath}`),
          }));

          this.setState({
            bakedItems: bakedItemsWithImages, // Update bakedItems with fetched data
            loading: false, 
            allbakedItems: bakedItemsWithImages// Set loading to false when data is available
          });
        })
        .catch((error) => {
          console.error('Error fetching baked items:', error);
          // Handle errors as needed, e.g., set an error state
        });
      }

    SetInvoice = async () =>{
      debugger
      debugger
      if (!this.state.cartItems) {
        return ;
      }
      // Recalculate total bill based on updated cart items
      const totalBill = this.state.cartItems.reduce(
        (total, item) => total + (item.numUnitPrice - item.numDiscount) * item.defaultUnit,
        0
      ).toFixed(2);
      const totalAmountBill = (parseFloat(totalBill) + parseFloat(this.state.deliveryCharges)).toFixed(2);
      
    const response = await BakedHouseService.setInvoice(this.state.cartItems, totalAmountBill, this.state.customer);
    
        
    }


    OnClear(){
      // Clear the cart items
      this.setState({ cartItems: [] , Invoice: [], customer: [], roundedTotalBill: 0});

       // Reset defaultUnit to 0 for all bakedItems
      const updatedBakedItems = this.state.bakedItems.map(item => ({
          ...item,
          defaultUnit: 0
    }));
    this.setState({ bakedItems: updatedBakedItems });

    }

    handleCheckOut = async (customerData) => {
     debugger
      await this.setState({ customer: customerData });
      await this.SetInvoice();
      this.OnClear();
      await this.GetBakedItems();
      await this.GetBakeHouseInvoices();
      }

    handleRemoveFromCart = (index) => {
        // Handle remove logic
        this.setState((prevState) => {
            const updatedCartItems = [...prevState.cartItems];
            updatedCartItems.splice(index, 1);
            return { cartItems: updatedCartItems };
          });
      }
    
    handleIncrement = (item) => {
        // Implement increment logic here
        const updatedBakedItems = this.state.bakedItems.map((bakedItem) => {
            if (bakedItem.numItemID === item.numItemID) {
              // Increment the defaultUnit only if it's less than numUnit
              const newDefaultUnit = Math.min(bakedItem.defaultUnit + 1, bakedItem.numUnit);
        
              return {
                ...bakedItem,
                defaultUnit: newDefaultUnit,
              };
            }
            return bakedItem;
          });
        
          this.setState({ bakedItems: updatedBakedItems });
      };
    
    handleDecrement = (item) => {
        // Implement decrement logic here
        const updatedBakedItems = this.state.bakedItems.map((bakedItem) => {
            if (bakedItem.numItemID === item.numItemID) {
              // Decrement the defaultUnit only if it's greater than 0
              const newDefaultUnit = Math.max(bakedItem.defaultUnit - 1, 0);
        
              return {
                ...bakedItem,
                defaultUnit: newDefaultUnit,
              };
            }
            return bakedItem;
          });
        
          this.setState({ bakedItems: updatedBakedItems });  
      };
    
      // handleAddToCart = (item) => {
      //   const { varItemName, numUnitPrice, numDiscount, defaultUnit } = item;
      
      //   const newItem = {
      //     varItemName,
      //     numUnitPrice,
      //     numDiscount,
      //     defaultUnit,
      //   };
      
      //   this.setState((prevState) => ({
      //     cartItems: [...prevState.cartItems, newItem],
      //   }));

      // };
      handleAddToCart = (item) => {
        const { numItemID, defaultUnit } = item;
        
        // Check if an item with the same numItemID already exists in cartItems
        const existingItemIndex = this.state.cartItems.findIndex(
          (cartItem) => cartItem.numItemID === numItemID
        );
      
        this.setState((prevState) => {
          const updatedCartItems = [...prevState.cartItems];
      
          if (existingItemIndex !== -1) {
            updatedCartItems[existingItemIndex] = {
              ...updatedCartItems[existingItemIndex],
              defaultUnit: updatedCartItems[existingItemIndex].defaultUnit + defaultUnit,
              totalPrice: (
                (updatedCartItems[existingItemIndex].defaultUnit + defaultUnit) *
                (item.numUnitPrice - item.numDiscount)
              ).toFixed(2),
            };
          } else {
            
            // If the item doesn't exist, add it to cartItems with the provided defaultUnit and calculated price
            const newItem = {
              ...item,
              defaultUnit,
              totalPrice: (defaultUnit * (item.numUnitPrice - item.numDiscount)).toFixed(2),
            };
            updatedCartItems.push(newItem);
          }
      
          return { cartItems: updatedCartItems };
        });
      };

   

    render() {
        const { bakedItems, currentPage, itemsPerPage, searchQuery, loading, notification } = this.state;

       // Check if bakedItems is undefined or null
  if (loading) {
    // Render a loading indicator or a message
    return <div>Loading...</div>;
  }

  // Check if bakedItems is an array and has a length
  if (!Array.isArray(bakedItems) || bakedItems.length === 0) {
    // Render a message indicating that there are no items
    return <div>No items available.</div>;
  }

        return (
            
          <div className='.bake-house'>
             <div><Header/></div>
            <div className='bake-house-left'>
            <div>
                <TextField
                        type="text"
                        placeholder="Search items..."
                        value={this.state.searchQuery}
                        name="searchQuery"
                        onChange={this.handleSearchChange}
                        />
            </div><br/>
              <div className="bake-item-list">
                  <div className="tile-container">
                          {
                          bakedItems.map((item) => (
                              <div key={item.numItemID} className="tile">
                              <h2>{item.varItemName}</h2>
                              <div className="image-container">
                              <div class="discount-label"><b> {item.numDiscount * 100}% off</b></div>
                                  <img src={item.varItemPath} alt={item.varItemName} />
                                  
                              </div>
                              <div className='item-price-tag'>
                               <div className='item-left'>
                                  <b> $ </b> {item.numUnitPrice} 
                               </div> 
                               <div>
                               Availability: {item.numUnit} 
                               </div>
                               {/* <div className='item-right'>
                                <b> {item.numDiscount * 100}% off</b>
                                </div> */}
                               
                              </div>
                              {/* <p>Price: ${item.numUnitPrice}</p>
                              <p>Available: {item.numUnit}</p>
                              <p>Discount: {item.numDiscount * 100}%</p> */}
                              <div className="quantity-container">
                                  <Button className='item-minus-plus' onClick={() => this.handleDecrement(item)}>-</Button>
                                  <span className="quantity">{item.defaultUnit}</span>
                                  <Button className='item-minus-plus' onClick={() => this.handleIncrement(item)}>+</Button>
                              </div>
                              <p><Button className={item.isSold ? 'disabledButton' : 'greenButton'} onClick={() => this.handleAddToCart(item)} disabled={item.isSold} >{item.isSold ? 'Sold Out' : 'Add to Cart'}</Button></p>
                              </div>
                          ))}
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                
                  </div>
              </div>
            </div>
            {/* <div className='cart'> */}
            <div className='bake-house-right'>
              <div>
              <Button className='btn-right' onClick={this.togglePopup}>Invoice History</Button>
              </div>
              
              <div>
                {/* Render the Invoice component inside a popup */}
                {this.state.isPopupOpen && (
                  <div className="popup">
                    <div className="popup-content">
                      <Button className='btn-right' onClick={this.togglePopup}>X</Button>
                      {/* Pass invoiceItems as a prop to the Invoice component */}
                      <Invoice invoiceItems={this.state.invoiceItems} currentDateTime = {this.state.currentDateTime} />
                    </div>
                  </div>
                )}
              </div>
              <div>
              <ShoppingCart deliveryCharges={this.state.deliveryCharges} cartItems={this.state.cartItems} onRemoveFromCart={this.handleRemoveFromCart} onCheckOut={this.handleCheckOut} customer={this.state.customer} />
                {/* <Invoice invoiceItems={this.state.invoiceItems} /> */}
                 {/* Button to toggle the popup */}
              </div>
                
           
               
            </div>
            <div className='clear'></div>
        </div>
        );
      }
}

export default BakeHouse;