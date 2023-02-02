import React from "react"
import { useNavigate } from "react-router-dom"
import { socketID, socket } from './GlobalSocket';


function Test2() {
  const navigate = useNavigate()
  function buttoon() {
    navigate("/Test1")
  }
  return (
    <div>
      <button onClick={buttoon}>go to the other page</button>
    </div>
  )
}
export default Test2
