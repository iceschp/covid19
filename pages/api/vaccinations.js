import moment from 'moment';

var https = require('https');
var csv = require('csv-parse'); 

export default async (req, res) => {
  const data = []
  const yesterday = moment().subtract(1, 'day').format("YYYY-MM-DD");
  const last2days = moment().subtract(2, 'day').format("YYYY-MM-DD");
  const last3days = moment().subtract(3, 'day').format("YYYY-MM-DD");
  const last4days = moment().subtract(4, 'day').format("YYYY-MM-DD");

  var url = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Thailand.csv";
  https.request(url, response => { 
    response.pipe(
      csv({
        trim: true,
        columns: true,
        delimiter: ',',
        skip_empty_lines: true
      })
    ).on('data', row => {

      const checkedDay = `${row['date']}`

      if (checkedDay === yesterday) {
        data.push({ row })
      } else if (checkedDay === last2days) {
        data.push({ row })
      } else if (checkedDay === last3days) {
        data.push({ row })
      } else if (checkedDay === last4days) {
        data.push({ row })
      } else {
        data.pop()
      }

    });
    response.on('end', () => {
        res.status(200).json({ data })
    });
    
  }).end();
  
}

