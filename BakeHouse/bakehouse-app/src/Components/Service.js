class Service {
    constructor() {
      this.instance = axios.create({
        baseURL: 'https://localhost:44312', // Set your API base URL here
      });
    }
}

apiCall = async (employee) => {
    await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employee) // body data type must match "Content-Type" header
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    }).catch(err=>{
      console.log(err)
    });
  }