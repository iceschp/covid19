import { useEffect, useState } from "react";

var http = require("http"); 
var https = require('https');
var csv = require('csv-parse'); 

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
    //console.log('***', row)
  });
}).end();

export default async (req, res) => {
  res.status(200).json({ test: 123 })
}