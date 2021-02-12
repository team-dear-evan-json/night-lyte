import React from 'react'

const OurStory = () => (
  <div id="story-container">
    <div className="story-content">
      <div className="yellow-radial">
        <h1 style={{fontSize: '30px'}}>
          “It is better to light a single candle than to curse the darkness.”
          <span style={{fontSize: '25px'}}> ― Eleanor Roosevelt</span>
        </h1>
        <p style={{fontSize: '20px'}}>
          <strong>Night Lyte</strong> is an interactive web map designed to help
          pedestrians safeguard their
          <br /> sense of personal safety while navigating New York City
          streets. Users can utilize
          <br /> the map’s visualization of key datasets – such as open
          businesses, subway
          <br /> entrances and recent crime incidents – to increase their
          “visibility”
          <br />
          and alter their walking route as desired.
        </p>{' '}
        <br /> <br />
        <p style={{fontSize: '25px'}}>
          <strong>Night Lyte is powered by:</strong> <br />
          <br />Mapbox, Yelp API, and NYC Open Data
        </p>
      </div>
    </div>
  </div>
)

export default OurStory
