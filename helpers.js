const isInDate = (estimate) => {
    const estimateDate = Date.parse(estimate.created_at);
    if (estimateDate <= dateTo && estimateDate >= dateFrom) {
        return true;
    }else {
        return false;
    }
}

const fetching = () => {
    document.getElementById("loader_donut").classList.toggle("pswp__preloader__donut");
}

const getIDs = async (estimates) => {
    let estimatesArr = estimates.estimates;
    let lastEstimateOnPage = estimatesArr[estimatesArr.length - 1];

    const getMatch = (item) => {
        if (item.location_id === storeID && isInDate(item) ){
            estimateIDs.push(item.id);
        }
    }

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


/* const merged = [].concat.apply([], lineItemsList);