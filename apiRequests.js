const queryString = 'https://pair.repairshopr.com/api/v1/estimates';
var numOfEstimatePages;

const getLineItemsFromEstimate = (ID) => {
    return new Promise ( async resolve => {
      try {
        const response = await fetch(queryString + '/' + ID, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':  token
        }
      });   

      const estimate = await response.json(); //extract JSON from the http response
      resolve(estimate.estimate.line_items); 
        } catch (error) {
         console.log(error);
         resolve();   
        }
    })
  };
  
const getPage1Estimates = () => {
    return new Promise ( async resolve => {
      try {
        const response = await fetch(queryString, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':  token
        }
      });   

      const responseJson = await response.json(); //extract JSON from the http response

      numOfEstimatePages = responseJson.meta.total_pages;

      resolve(responseJson); 
        } catch (error) {
         console.log(error);
         resolve();   
        }
    })
};
