//is the estimate between the selected dates
const isInDate = (estimate) => {
    const estimateDate = Date.parse(estimate.created_at);
    if (estimateDate <= dateTo && estimateDate >= dateFrom) {
        return true;
    }else {
        return false;
    }
}

//Finds index on part quantity array for selected store
const selectedStoreQuantity = (quantities) => {
    return quantities.findIndex(item => {
      if (item.location_id == storeID){
        return true;
      }
      return false;
    });
} 

//If estimate matches selected parameters then it pushes its id to an array 
const getMatch = (item) => {
    if (item.location_id === storeID && isInDate(item) ){
        estimateIDs.push(item.id);
    }
}

//Gets ids from estimates with selected parameters using getMatch()
const getIDs = async (estimates) => {
    let estimatesArr = estimates.estimates;
    let lastEstimateOnPage = estimatesArr[estimatesArr.length - 1];

    let count = 2;
    while (isInDate(lastEstimateOnPage)){
        const nextPage = await getGivenPageEstimates(count);
        estimatesArr = estimatesArr.concat(await nextPage.estimates);
        lastEstimateOnPage = await nextPage.estimates[await nextPage.estimates.length - 1];
        count++;
    }

    estimatesArr.forEach(getMatch);
    return estimateIDs;
}

//Expands details of other store stock levels
const detailExpand = (num) => {
    document.getElementById(`details${num}`).classList.toggle("expand");
}

//Toggles loading icon
const fetching = () => {
    document.getElementById("loader_donut").classList.toggle("pswp__preloader__donut");
}

//Checks to see if loading icon is active
const isFetching = () => {
    return document.getElementById("loader_donut").classList.contains('pswp__preloader__donut');
}

//Makes a list of Estimates ids
const makeEstimateIdList = () => {
    return new Promise (async resolve => {
      const estimateIdList = await getPage1Estimates().then(estimates => getIDs(estimates));
      resolve(estimateIdList);
    })
};
  
//Makes a list of estimate line item ids
const getLineItemIds = async () => {
    const estimateIdList = await makeEstimateIdList();
    const estimateLineItems = estimateIdList.map( id => getLineItemsFromEstimate(id));
    let productIdList = [];
    for (let i = 0; i < estimateLineItems.length; i++) {
        let lineItems = await estimateLineItems[i];
        for (let i = 0; i < lineItems.length; i++) {
        (lineItems[i].product_id && lineItems[i].cost != '0.0') && productIdList.push(lineItems[i].product_id); //creates product ID list and excludes products that have no id and have a cost of "0.0".
        }
    }     
    productIdList = productIdList.filter(function(item, pos) {return productIdList.indexOf(item) == pos;}); //removes duplicates
    return productIdList;
}

//Makes a final list of product details 
const getProductDetailList = async (lineItemIds) => {
    let productDetailList = [];
    for (let i = 0; i < lineItemIds.length; i++) {
        productDetailList.push((await getProductDetail(lineItemIds[i])).product);
    }
    return productDetailList;
}

//Sets date based on input or defaults to last 7 days if none
const setDate = (dateFromInput, dateToInput) => {
    if (dateFromInput && dateToInput) {
      dateFrom = Date.parse(dateFromInput) - 3599999; // Subtracting almost an hour to bring it to 1ms after midnight
      dateTo = Date.parse(dateToInput) + 82799999; //Adding 24h - 1ms Hours to bring time to 1ms before midnight on the 'to' date
    } else {
      let milliToday = Date.now() % 86400000; //Number of milliseconds so far today
      dateFrom = Date.now() - 604800000 - milliToday; //1 week ago rounded up to nearest day
      dateTo = Date.now();
    }
} 