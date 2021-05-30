const queryString = 'https://pair.repairshopr.com/api/v1/estimates';
var numOfEstimatePages;

const getLineItemsFromEstimate = (item) => {
    return new Promise ( async resolve => {
      try {
        const response = await fetch(queryString + '/' + item, {
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

  const getAllLineItems = (items) => {
    return new Promise ( resolve => {
    var lineItems = [];
      items.forEach( item => {
        lineItems.push( getLineItemsFromEstimate(item))
      })
      resolve(lineItems);
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
      
      //console.log(responseJson.meta.total_pages);

      numOfEstimatePages = responseJson.meta.total_pages;

      resolve(responseJson); 
        } catch (error) {
         console.log(error);
         resolve();   
        }
    })
};

const getEstimateNumOfPages = () => {
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
        const EstimateNumOfPages = responseJson.meta.total_pages
        
        console.log(EstimateNumOfPages);
  
        resolve(EstimateNumOfPages); 
          } catch (error) {
           console.log(error);
           resolve();   
          }
      })
}
