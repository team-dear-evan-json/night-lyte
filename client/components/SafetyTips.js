import React from 'react'

const SafetyTips = () => (
  <div id="tips-container">
    <div className="tips-content">
      <div className="tip">
        <h1>People</h1>
        <p>
          Use well-populated and well-lit streets. When walking in desolate
          areas, do so in groups.
        </p>
      </div>
      <div className="tip">
        <h1>Open Stores</h1>
        <p>
          If you suspect you're being followed, stay away from deserted blocks
          and head for areas where there are people or to the nearest open
          store.
        </p>
      </div>
      <div className="tip">
        <h1>Evade or Yell</h1>
        <p>
          Should a motorist bother you while you are walking, reverse your
          direction. If you are still followed, seek a safe location and yell
          for help, if possible.
        </p>
      </div>
      <div className="tip">
        <h1>Escort</h1>
        <p>
          If you're driven home, ask the driver to wait until you are safely
          inside.
        </p>
      </div>
      <div className="tip">
        <h1>Report It.</h1>
        <p>
          Immediately report a theft or suspicious activity to the NYPD by
          calling 911.
        </p>
      </div>
    </div>
    <p className="tips-source" style={{fontSize: '1em'}}>
      Source: NYPD Crime Prevention Division ― Walking tips for personal safety
    </p>
  </div>
)

export default SafetyTips
