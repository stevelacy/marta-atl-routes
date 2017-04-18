const fs = require('fs')
const parse = require('csv-parse')
const request = require('superagent')
const autoParse = require('./autoParse')
const JSONStream = require('JSONStream')
const through = require('through2')

const trips = require('./data/trips.json')

const url = process.argv[2] || 'http://opendata.itsmarta.com/hackathon/2016/October/GTFS/Stop_Times.csv' //'http://opendata.itsmarta.com/hackathon/2017/February/GTFS/shapes.csv'
/*

Shape {
  trip_id: '5437938',
  arrival_time: '09:19:00',
  departure_time: '09:19:00',
  stop_id: '903009',
  stop_sequence: '1'
}

*/

const parseOpts = {
  columns: true,
  strict: false,
  mapHeaders: (v) => v.trim(),
  mapValues: (v) => autoParse(v.trim())
}

const data = []
const finput = fs.createReadStream('./raw/stop_times_oct_16.csv')
const fout = fs.createWriteStream('./data/trips_locations.json')

const jsonS = JSONStream.stringify()
const second = through.obj()

second.pipe(jsonS).pipe(fout)
finput.pipe(new parse(parseOpts))
  .on('data', (d) => {
    const t = trips.filter((v) => v.trip_id === d.trip_id)
    t.forEach((v) => {
      let out = {
        trip_id: d.trip_id,
        arrival_time: d.arrival_time,
        departure_time: d.departure_time,
        stop_id: d.stop_id,
        route_id: v.route_id,
        trip_headsign: v.trip_headsign,
        shape_id: v.shape_id
      }
      second.push(out)
    })
  })
  .on('end', () => second.emit('end'))
// .pipe(fout)
