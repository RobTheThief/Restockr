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

const detailExpand = (num) => {
    document.getElementById(`details${num}`).classList.toggle("expand");
}

const fetching = () => {
    document.getElementById("loader_donut").classList.toggle("pswp__preloader__donut");
}