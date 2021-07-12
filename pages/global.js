import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import moment from 'moment';
import React, { useState, useEffect, PureComponent, Component, useLayoutEffect } from 'react';
import Link from 'next/link'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import Select from 'react-select'
import { useRouter } from 'next/dist/client/router';

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} 
        textAnchor="end" fill="#666" transform="rotate(-35)" 
        fontSize="10px">
          {payload.value}
        </text>
      </g>
    );
  }
}

function removeDuplicates(data, key) {
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]
};

export default class Global extends React.Component{ 
  constructor(props) {
    super(props);
    this.state = {
    selectedCountry: '',
    confirmedGlobalCases: this.props.confirmedGlobalCases,
    deathGlobalCases: this.props.deathGlobalCases,
    recoveredGlobalCases: this.props.recoveredGlobalCases,
    dailyReportsGlobal: this.props.dailyReportsGlobal,
    confirmed: [],
    country: [],
    recoverd: [],
    options: [],
    dataMap: [],
    date: {},
    recoveredNum: {},
    deathsNum: {},
    confirmedNum: {}
    };
    
    this.handleChange = this.handleChange.bind(this);    
  }

  componentDidMount() {
    const confirmed = this.props.confirmedGlobalCases.map((con) => {
      var filteredData =  _.omit(con.row,["Province/State", "Country/Region", "Lat", "Long"])
      return filteredData
    })
    
    this.setState({ confirmed:confirmed })
    
    var country = this.props.confirmedGlobalCases.map((con) => {
      var filteredData =  con.row["Country/Region"]
      return filteredData
    })

    const recoverd = this.props.recoveredGlobalCases.map((re) => {
      var filteredData =  _.omit(re.row,[ "Province/State", "Country/Region", "Lat", "Long"])
      return filteredData
    })
      
    const deaths = this.props.deathGlobalCases.map((death) => {
      var filteredData =  _.omit(death.row,["Province/State", "Country/Region", "Lat", "Long"])
      return filteredData
    })
 
    const date = Object.keys(confirmed[0])
    const confirmedNum = Object.values(confirmed[0])
    const recoveredNum = Object.values(recoverd[0])
    const deathsNum = Object.values(deaths[0])

    this.setState({ confirmedNum: confirmedNum })
    this.setState({ date: date });
    this.setState({ recoveredNum: recoveredNum });
    this.setState({ deathsNum: deathsNum });

    this.setState({
      dataMap : confirmedNum.map((values, index) => ({ 
        "date": date[index], 
        "Confirmed": values, 
        "Recovered": recoveredNum[index], 
        "Deaths": deathsNum[index],
      }))
    })

    country = removeDuplicates(country, item => item)

    this.setState({options:country.map(count => ({ 
      value: count, 
      label: count, 
    }))})
  }

  componentDidUpdate(prevProps, prevState){

    if (prevState.selectedCountry !== this.state.selectedCountry) {
      console.log(1);
      console.log(this.props.confirmedGlobalCases)
      
      const confirmed = this.props.confirmedGlobalCases
      .filter((option) => option.row["Country/Region"]
      .toLocaleLowerCase()
      .includes(this.state.selectedCountry
      .toLocaleLowerCase()))
      .map((con) => {
        var filteredData =  _.omit(con.row,["Province/State", "Country/Region", "Lat", "Long"])
        return filteredData
        })

      const confirmedNum = Object.values(confirmed[0])

      var dataMap = confirmedNum
      .map((value, index) => ({ 
        "date": this.state.date[index], 
        "Confirmed": value, 
        "Recovered": this.state.recoveredNum[index], 
        "Deaths": this.state.deathsNum[index]
      }))
        console.log(2)
        console.log(dataMap)
        this.setState({ dataMap: dataMap })
    }
  }

  handleChange(e) {
    this.setState({ selectedCountry: e.value });
  }
  
  render() {
    return (
      <div className="md:container md:mx-auto" >
      <div className="grid grid-cols-6 gap-4">
      <div className="col-start-2 col-span-4 ...">
      <div className="text-center">
        <br />
        <h1 className="text-4xl font-bold">
          🦠 CONFIRMED CASES BY COUNTRY 🦠
        </h1>
        <p className="text-sm">
          Last updated: {moment().subtract(1, 'days').format("MM-DD-YYYY")}
        </p>
        <br />
        <div className="center">
          <p className="text-lg font-semibold" >📍Country: &nbsp;</p>
          <Select id="selectedCountry" options={this.state.options} className="widthSelect" onChange={this.handleChange}/>
        </div>
      </div>

      <div className="mt-10">
      <div className="bg-white rounded-lg py-4 px-4 ">
        <p className="font-bold text-2xl">COVID-19 Confirmed Cases Graph 🌐</p>
      
      <div className="grid justify-items-center">
        <ResponsiveContainer  width="99%" aspect={2}>
        <LineChart id="lineChart" className="bg-white rounded-lg mt-5" 
        data={this.state.dataMap} width={800} height={500} >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" height={60} padding={{ left: 5, right: 5 }} tick={<CustomizedAxisTick />} />
          <YAxis type="number" domain={ [0,300000] } />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Confirmed" stroke="#009BDE" />
          <Line type="monotone" dataKey="Recovered" stroke="#C4D600" />
          <Line type="monotone" dataKey="Deaths" stroke="#EB0029" />
        </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>

      <div className="text-center">
        <button type="button" className="border-yellow-300 border-2 
        text-xl font-bold rounded-lg py-3 px-3
        mt-5 bg-gradient-to-r bg-white 
        hover:from-pink-500 hover:to-yellow-500 ...">
          <Link href="http://localhost:3000">
            <a>🔍 COVID-19 Thailand</a>
          </Link>
        </button>
      </div>
      <br />

      </div>
      </div>
      </div>
    )}}

// multiple fetch
export async function getServerSideProps() {
  const domain = `http://localhost:3000`;
  const apiTimeSeriesSet = `/api/timeSeriesGlobal`;
  const [
    confRes, 
    deathGlobalRes, 
    recGlobalRes,
  ] = await Promise.all([
    fetch(`${domain}${apiTimeSeriesSet}/confGlobal`),
    fetch(`${domain}${apiTimeSeriesSet}/deathGlobal`),
    fetch(`${domain}${apiTimeSeriesSet}/recGlobal`),
  ]);
  
  const [
    confirmedGlobalCases, 
    deathGlobalCases, 
    recoveredGlobalCases,
  ] = await Promise.all([
    confRes.json(),
    deathGlobalRes.json(),
    recGlobalRes.json(),
  ]);

  return { 
    props: { 
      confirmedGlobalCases: confirmedGlobalCases.data,
      deathGlobalCases: deathGlobalCases.data,
      recoveredGlobalCases: recoveredGlobalCases.data,
    }
  }};
