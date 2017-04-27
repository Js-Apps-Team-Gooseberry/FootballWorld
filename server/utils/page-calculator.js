/* globals module */

function getPagesCount(itemsCount, pageSize) {
    let pagesCount = Math.ceil(itemsCount / pageSize);
    return pagesCount;
}

module.exports.getPagesCount = getPagesCount;