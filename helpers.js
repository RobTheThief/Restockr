//Copies text of given element
const copyText = (count) => {
    let range = document.createRange();
    let tooltipElement = document.getElementById(`tooltip_text_id_${count}`);
    var elementToCopy = document.getElementById(`result_name_id_${count}`);
    range.selectNode(elementToCopy);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
    tooltipElement.innerHTML = 'Copied!';
    tooltipElement.classList.add('copied');
    setTimeout(() => {
        tooltipElement.classList.remove('copied');
        tooltipElement.innerHTML = 'Copy';
    }, 1500);
}

//Expands details of other store stock levels
const detailExpand = (num) => {
    document.getElementById(`details${num}`).classList.toggle("expand");
}

//Toggles loading icon for restockr
const fetchingRestockr = () => {
    document.getElementById("loader_donut_restockr").classList.toggle("pswp__preloader__donut");
}

//Toggles loading icon for check invoices
const fetchingInvoices = () => {
    document.getElementById("loader_donut_invoices").classList.toggle("pswp__preloader__donut");
}

//Gets ids from estimates with selected parameters using getMatch()
const getEstimateIDs = async (estimates) => {
    let count = 2;
    let estimatesArr = estimates.estimates;
    let lastEstimateOnPage = estimatesArr[estimatesArr.length - 1];
    
    while (isInDate(lastEstimateOnPage) || Date.parse(lastEstimateOnPage.created_at) > dateTo ){
        const nextPage = await getGivenPageEstimates(count);
        estimatesArr = estimatesArr.concat(await nextPage.estimates);
        lastEstimateOnPage = await nextPage.estimates[await nextPage.estimates.length - 1];
        count++;
    }
    
    estimatesArr.forEach(getMatch);
    return estimateIDs;
}

//If estimate matches selected parameters then it pushes its id to an array 
const getMatch = (item) => {
    (item.location_id === storeID && isInDate(item)) && estimateIDs.push(item.id);
}

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

//Checks to see if loading icon is active for restockr
const isFetchingRestockr = () => {
    return document.getElementById("loader_donut_restockr").classList.contains('pswp__preloader__donut');
}

//Checks to see if loading icon is active for invoices
const isFetchingInvoices = () => {
    return document.getElementById("loader_donut_invoices").classList.contains('pswp__preloader__donut');
}

//is the estimate between the selected dates
const isInDate = (estimate) => {
    const estimateDate = Date.parse(estimate.created_at);
    if (estimateDate <= dateTo && estimateDate >= dateFrom) return true;
    return false;
}

//Makes a list of Estimates ids
const makeEstimateIdList = () => {
    return new Promise (async resolve => {
        const estimateIdList = await getPage1Estimates().then(estimates => getEstimateIDs(estimates));
        resolve(estimateIdList);
    })
};
  

//Finds index on part quantity array for selected store
const selectedStoreQuantityIndex = (quantities) => {
    return quantities.findIndex(item => {
     return item.location_id == storeID ? true : false;
    });
}

//Sets date based on input or defaults to last 7 days if none
const setDate = (dateFromInput, dateToInput) => {
    if (dateFromInput && dateToInput) {
        if (dateFromInput > dateToInput) return 'ERROR: CHECK DATES';
        dateFrom = Date.parse(dateFromInput) - 3599998; // Subtracting almost an hour to bring it to 1ms after midnight
        dateTo = Date.parse(dateToInput) + 82799999; //Adding almost 23h to bring time to 1ms before midnight on the 'to' date
    } else {
      let milliToday = Date.now() % 86400000; //Number of milliseconds so far today
      dateFrom = Date.now() - 604800000 - milliToday; //1 week ago rounded up to nearest day
      dateTo = Date.now();
    }
} 
