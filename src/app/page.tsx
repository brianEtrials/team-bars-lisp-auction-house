'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import { Model, Constant } from '../model'

// The "props" passed in contains properties from "higher up" in the system that we need to render here.
// These are the array of constants as stored in the model. This function will return 
function ConstantList(props) {
  let constants:Array<Constant> = props.constants

  // For each constant in constants, generate a <li> ... </li> block containing name and value
  return (
  <ul>
    { constants.map(constant => (
          <li key={constant.name}><b>{constant.name}</b> = {constant.value}</li>
        )
      )
    }
  </ul>  
  )
}

export default function Home() {
  const [model, setModel] = React.useState(new Model())
  const [redraw, forceRedraw] = React.useState(0)       // used to conveniently request redraw after model change

  const andRefreshDisplay = () => {
      forceRedraw(redraw+1)
  }

  function addTwoNumbers() {
      let arg1 = document.getElementById("one") as HTMLInputElement
      let arg2 = document.getElementById("two") as HTMLInputElement
      if (arg1 && arg2) {
          let val1 = model.getValue(arg1.value)
          let val2 = model.getValue(arg2.value)
          let result = document.getElementById("result") as HTMLInputElement
          result.value = String(val1 + val2)
      }
  }
  
  function createConstant() {
    // potentially modify the model
    let name = document.getElementById("constant-name") as HTMLInputElement
    let value = document.getElementById("constant-value") as HTMLInputElement
    if (name && value) {
      model.define(name.value, parseFloat(value.value))

      // clear inputs
      name.value = ''
      value.value = ''
      andRefreshDisplay()          // force a redraw by incrementing this state count
    }
  }
  
  function removeConstant() {
    // potentially modify the model
    let name = document.getElementById("constant-name") as HTMLInputElement
    
    if (model.remove(name.value)) {
      andRefreshDisplay()          // force a redraw by incrementing this state count
    }

    // clear input
    name.value = ''
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
      one: <input className="text" id="one" />&nbsp;
      two: <input className="text" id="two" />&nbsp;
      <button className="button" onClick={(e) => addTwoNumbers()}>Add</button><p></p><br></br>
      result: <input className="text" id="result" readOnly/><p></p>
      <br></br><br></br>
      <h1>Constants</h1>
      name: <input className="text" id="constant-name"/>&nbsp;
      value: <input className="text" id="constant-value"/>&nbsp;
      <button className="button" onClick={(e) => createConstant()}>Create</button>&nbsp;
      <button className="button" onClick={(e) => removeConstant()}>Remove</button><p></p>
      <ConstantList constants={model.constants}/>

      </div>
    </main>
  )
}
