import moment from 'moment'
import _ from 'lodash';

var https = require('https');
var csv = require('csv-parse'); 

export default async (req, res) => {
  const data = []
  var url

  const domain = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports`;

  var dayCount = 0
  var day = `/${moment().subtract(dayCount, 'day').format("MM-DD-YYYY")}.csv`;
  
  url = `${domain}${day}`

  while (true) {
    let res = await fetch(url)
    if (res.status !== 200) {
      dayCount += 1
      day = `/${moment().subtract(dayCount, 'day').format("MM-DD-YYYY")}.csv`;
      url = `${domain}${day}`
      // console.log("Data loading...")
    }
    else {
      break;
    }
  }
  
  https.request(url, response => { 
    response.pipe(
      csv({
        trim: true,
        columns: true,
        delimiter: ',',
        skip_empty_lines: true
      })
    ).on('data', row => {
      if(row['Country_Region'] == 'Thailand'){
        data.push(_.omit(row, [
          "FIPS", 
          "Admin2", 
          "Province_State", 
          "Lat", 
          "Long_",
          "Case_Fatality_Ratio",
          "Incident_Rate",
        ]));
       }
    });
    response.on('end', () => {
      res.status(200).json({ data })
    });
    
  }).end();

}
