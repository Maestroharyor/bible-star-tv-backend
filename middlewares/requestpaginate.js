const paginated_result = (page, per_page, count, query, startIndex = (page - 1) * per_page, endIndex = page * per_page) => {

    const result = {};

    result.current_page = page;
    result.per_page = per_page;

    if (endIndex < (count)) {
        result.next_page = {
          page: page + 1,
          per_page: per_page,
        };
      }
    if (startIndex > 0) {
        result.previous_page = {
          page: page - 1,
          per_page: per_page,
        };
    }
      result.has_next_page = endIndex < count ? true: false;
      result.total_result  = count;
      result.query = query;

    return result;
}
 
module.exports = {
    paginated_result
}