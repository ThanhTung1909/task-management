module.exports = (objbectPagination, query, countRecords) => {
    if(query.page){
        objbectPagination.currentPage = parseInt(query.page);
    }
    if(query.limit){
        objbectPagination.limitItems = parseInt(query.limit);
    }
    objbectPagination.skip = (objbectPagination.currentPage - 1) * objbectPagination.limitItems;

    const totalPage = Math.ceil(countRecords/objbectPagination.limitItems);
    objbectPagination.totalPage = totalPage;

    return objbectPagination;
}