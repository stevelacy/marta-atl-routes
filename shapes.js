const fs = require('fs')
const parse = require('csv-parse')
const request = require('superagent')
const autoParse = require('./autoParse')

const urls = {
  shapes: 'http://opendata.itsmarta.com/hackathon/2017/February/GTFS/shapes.csv'
}
/*

Shape {
  shape_id: 99590,
  shape_pt_lat: 33.69175,
  shape_pt_lon: -84.489849,
  shape_pt_sequence: 78
}

*/

const parseOpts = {
  columns: true,
  strict: false,
  mapHeaders: (v) => v.trim(),
  mapValues: (v) => autoParse(v.trim())
}

const routes = {}
let lastShape = null

request.get(urls.shapes).pipe(new parse(parseOpts))
  .once('data', (v) => {
    console.log(v)
    if (v.shape_id !== lastShape) {
      console.log('shape: ', v.shape_id)
      lastShape = v.shape_id
    }
    const coordinates = [ parseFloat(v.shape_pt_lon), parseFloat(v.shape_pt_lat) ]
    if (routes[v.shape_id]) {
      routes[v.shape_id].path.coordinates.push(coordinates)
      return
    }
    routes[v.shape_id] = {
      sourceId: v.shape_id,
      path: {
        type: 'LineString',
        coordinates: [ coordinates ]
      }
    }
  })
  .on('end', () => {
    const res = Object.keys(routes).map((v) => routes[v])
    fs.writeFile('./data/routes.json', JSON.stringify(res), (err, res) => {
      if (err) console.error(err)
    })
  })

