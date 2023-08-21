import React, { Component } from 'react';
import BakedItemService from './BakedHouseService';
import './BakeHouse.css';

class BakeryItem extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          bakedItems: [{
            numItemID: 1,
            varItemName: 'Sandwiches',
            varItemPath: require('../Images/sandwich.jpg'),
            numUnitPrice: 2.5,
            numUnit: 10,
            numDiscount: 0.2,
            isSold: true,
            defaultUnit: 5
          },
          {
            numItemID: 2,
            varItemName: 'Baguettes',
            varItemPath: require('../Images/baguettes.jpg'),
            numUnitPrice: 2.5,
            numUnit: 10,
            numDiscount: 0.2,
            isSold: false,
            defaultUnit: 0
          },
          {
            numItemID: 3,
            varItemName: 'Wraps',
            varItemPath: require('../Images/wraps.jpg'),
            numUnitPrice: 2.5,
            numUnit: 10,
            numDiscount: 0.2,
            isSold: false,
            defaultUnit: 0
          },
          {
            numItemID: 4,
            varItemName: 'Mozzarella Sticks',
            varItemPath: require('../Images/mozzsticks.jpg'),
            numUnitPrice: 2.5,
            numUnit: 10,
            numDiscount: 0.2,
            isSold: false,
            defaultUnit: 0
          }
        ],
          cartItems: [],
          currentPage: 1,
          itemsPerPage: 3,
          searchQuery: ''
        };
      }
    
    //   componentDidMount() {
    //     BakedItemService.getBakedItems()
    //       .then((bakedItems) => {
    //         this.setState({ bakedItems });
    //       })
    //       .catch((error) => {
    //         // Handle error
    //       });
    //   }
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
    
      handleAddToCart = (item) => {
        const { varItemName, numUnitPrice, numDiscount, defaultUnit } = item;
      
        const newItem = {
          varItemName,
          numUnitPrice,
          numDiscount,
          defaultUnit,
        };
      
        this.setState((prevState) => ({
          cartItems: [...prevState.cartItems, newItem],
        }));
      };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
      };

      handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
      };

    render() {
        const { bakedItems, currentPage, itemsPerPage, searchQuery } = this.state;

         // Filter items based on search query
            const filteredItems = bakedItems.filter((item) =>
            item.varItemName.toLowerCase().includes(searchQuery.toLowerCase())
        );

         // Calculate indexes of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

        return (
            
          <div className="bake-item-list">
             <h1>Welcome to BakeHouse</h1>
             
            <div>
                <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                        />
            </div><br/>
            <div className="tile-container">
                    {
                    bakedItems.map((item) => (
                        <div key={item.numItemID} className="tile">
                        <h3>{item.varItemName}</h3>
                        <div className="image-container">
                            <img src={item.varItemPath} alt={item.varItemName} />
                        </div>
                        <p>Price: ${item.numUnitPrice}</p>
                        <p>Available Units: {item.numUnit}</p>
                        <p>Discount: {item.numDiscount * 100}%</p>
                        <div className="quantity-container">
                            <button onClick={() => this.handleDecrement(item)}>-</button>
                            <span className="quantity">{item.defaultUnit}</span>
                            <button onClick={() => this.handleIncrement(item)}>+</button>
                        </div>
                        <p><button onClick={() => this.handleAddToCart(item)} disabled={item.isSold}>{item.isSold ? 'Sold' : 'Add to Cart'}</button></p>
                        </div>
                    ))}
            </div>

         {/* Pagination */}
         <div className="pagination">
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => this.handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {/* <ShoppingCart cartItems={this.state.cartItems} onRemoveFromCart={this.handleRemoveFromCart} /> */}
        </div>
        );
      }
}

export default BakeryItem;