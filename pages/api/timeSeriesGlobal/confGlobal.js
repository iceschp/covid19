var https = require('https');
var csv = require('csv-parse'); 

export default async (req, res) => {
  const data = []
  var url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
  https.request(url, response => { 
    response.pipe(
      csv({
        trim: true,
        columns: true,
        delimiter: ',',
        skip_empty_lines: true
      })
    ).on('data', row => {
        data.push({ row });
    });
    response.on('end', () => {
      res.status(200).json({ data })
    });
    
  }).end();

}