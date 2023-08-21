import axios from 'axios';


class BakedHouseService {
  // constructor() {
  //   this.instance = axios.create({
  //     baseURL: 'https://localhost:44312', // Set your API base URL here
  //   });
  // }

  constructor() {
    this.state = {
      notification: null, // Initialize the notification state as null
    };
  }

  
  static async getBakedItems() {
    try {
      // const headers = {
      //   "Content-Type": "application/json",
      //   "Access-Control-Allow-Origin": "*"
      // };
      return await axios.get('http://localhost:45965/api/bakedhouse/getbakeditems');

     
    // const response = await fetch('https://localhost:44312/api/bakedhouse/getitemlist', {headers}); 
    const response =  axios.get('http://localhost:17078/api/bakedhouse/getbakeditems');
     // alert(JSON.stringify(response.data))
      // debugger
      // if (!response.ok) {
      //   throw new Error('Failed to fetch baked items');
      // }
      return JSON.stringify(response.data);
      // const bakedItems = await response.data.json();
      // return bakedItems;
    } catch (error) {
      console.error('Error fetching baked items:', error);
      throw error;
    }
  }

  static async getBakeHouseInvoices() {
    debugger
    try {
      return await axios.get('http://localhost:45965/api/bakedhouse/getbakedhouseinvoices');

    } catch (error) {
      console.error('Error fetching baked items:', error);
      throw error;
    }
  }

//   static async setInvoice (cartItems, roundedTotalBill, customer) {
//     debugger
//     try {
//       const response =  await axios.post('http://localhost:45965/api/bakedhouse/setinvoice', {
//         CartItems: cartItems,
//         Customer: customer,
//         TotalBill: roundedTotalBill
//       });
  
//       // Handle success response (e.g., show a success message)
//       console.log('Order placed successfully:', response.data);
//     } catch (error) {
//       // Handle errors (e.g., show an error message)
//       console.error('Error placing the order:', error);
//     }
//   };
// }
static async setInvoice(cartItems, roundedTotalBill, customer) {
  try {
    const orderData = {
      CartItems: cartItems,
      TotalBill: roundedTotalBill,
      Customer: customer
      //JSON.stringify(customer),
    };

   debugger

    const response = await axios.post('http://localhost:45965/api/bakedhouse/setinvoice', orderData);
    debugger
    alert(JSON.stringify(response.data.varResponseMessage));
    return response;
    // Handle success response (e.g., show a success message)
    
    console.log('Order placed successfully:', response.data);
  } catch (error) {
    // Handle errors (e.g., show an error message)
    console.error('Error placing the order:', error);
    
  }
}
}

export default BakedHouseService;