const formatRupiah = (value) =>{
    return new Intl.NumberFormat("id-ID",{
        style:'currency',
        currency:"IDR"
    }).format(value)
}
const formatDate = (value) =>{
    const date = value;
      const yyyy = date.getFullYear();
      const mm = date.getMonth() + 1; // Months start at 0!
      const dd = date.getDate();

		  return [ yyyy, mm < 10 ? `0${mm}` : mm, dd < 10 ? `0${dd}` : dd ].join('-')
}
module.exports = {formatRupiah,formatDate}