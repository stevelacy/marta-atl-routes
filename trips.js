const fs = require('fs')
const parse = require('csv-parse')
const request = require('superagent')
const autoParse = require('./autoParse')
const findIndex = require('lodash.findindex')

const url = process.argv[2] || 'http://opendata.itsmarta.com/hackathon/2016/October/GTFS/Trips.csv' //'http://opendata.itsmarta.com/hackathon/2017/February/GTFS/trips.csv'

fs.exists('./data/routes.json', (exists) => {
  if (!exists) {
    throw new Error('routes.json not found. Please run node shapes.js first')
  }
})
fs.exists('./data/stop_times.json', (exists) => {
  if (!exists) {
    throw new Error('stop_times.json not found. Please run node stop_times.js first')
  }
})

const routes = require('./data/routes.json')
// const stopTimes = require('./data/stop_times.json')
/*

Trip {
  route_id: 7651,
  service_id: 4,
  trip_id: 5455974,
  trip_headsign: 'Route 27 - Lindbergh Station / Marta Headquarters',
  direction_id: 0,
  block_id: 300775,
  shape_id: 99921
}

*/

const parseOpts = {
  columns: true,
  strict: false,
  mapHeaders: (v) => v.trim(),
  mapValues: (v) => autoParse(v.trim())
}

const trips = {}
request.get(url).pipe(new parse(parseOpts))
  .once('data', (v) => {
    return console.log(v)
    // const routeIndex = findIndex(routes, { sourceId: v.shape_id })
    // console.log(routeIndex)
    // if (routeIndex === -1) return
    // const route = routes[routeIndex]
    const stopIndex = stopTimes.filter((e) => { e.trip_id === v.trip_id })
    console.log(stopIndex)
    console.log(v.trip_id, stopTimes[0].trip_id)
    return
    if (stopIndex === -1) return
    const stop = stopTimes[stopIndex]
    return console.log(route, stop)
    const coordinates = [ parseFloat(v.shape_pt_lon), parseFloat(v.shape_pt_lat) ]
    trips[v.trip_id] = {
      sourceId: v.trip_id,
      path: route.path,
      name: v.trip_headsign
    }
  })
  .on('end', () => {
    // const res = Object.keys(routes).map((v) => routes[v])
    // fs.writeFile('./data/routes.json', JSON.stringify(res), (err, res) => {
    //   if (err) console.error(err)
    // })
  })

