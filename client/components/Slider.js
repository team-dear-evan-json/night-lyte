import React from 'react'

const Slider = () => {
  return (
    <div id="mySidepanel" className="sidepanel">
      <div id="slider" className="panel-item">
        <label htmlFor="slider">Time of Night:</label>
        <fieldset className="range__field">
          <input className="range" type="range" min="1" max="3" name="slider" />
          <svg
            role="presentation"
            width="100%"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect className="range__tick" x="0%" y="3" width="1" height="10" />
            <rect className="range__tick" x="50%" y="3" width="1" height="10" />
            <rect
              className="range__tick"
              x="100%"
              y="3"
              width="1"
              height="10"
            />
          </svg>
          <svg
            role="presentation"
            width="100%"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text className="range__point" x="0%" y="14" textAnchor="start">
              NOW
            </text>
            <text className="range__point" x="50%" y="14" textAnchor="middle">
              11PM
            </text>
            <text className="range__point" x="100%" y="14" textAnchor="end">
              2AM
            </text>
          </svg>
        </fieldset>
      </div>
    </div>
  )
}

export default Slider
