import React, { useState } from "react"
import { useDispatch } from "react-redux"
import {
  setNotification,
  setNotificationMessage,
  setError,
  setErrorMessage,
} from "../../app/appState"
import * as config from "../../config/config.json"
import { useHistory } from "react-router-dom"
import axios from "axios"

interface RegisterResponse {
  ok: number
  data: {
    message: string
    userId?: number
  }
}

export function Register() {
  const history = useHistory()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const data = {
      username,
      email,
      password,
    }

    try {
      const submitRequest = await axios.post(
        `http://${config.kukaHost}:${config.kukaPort}/local/user/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Dev-Token":
              config.dev == "true" ? "devtoken123" : "wrongtoken",
          },
        }
      )
      console.log("SUBMIT REQUEST:")
      console.log(submitRequest)
      if (submitRequest.status == 201) {
        console.log("HEP")
        dispatch(setNotification(true))
        dispatch(
          setNotificationMessage(
            "Verify your account by clicking the link in your email"
          )
        )
      } else {
        dispatch(setError(true))
        dispatch(setErrorMessage("Something went wrong"))
      }
    } catch (e) {
      console.log("SUBMIT CATCH:")
      console.log(JSON.stringify(e.response, null, 2))
      // If username not found
      if (e.response && e.response.status == 404) {
        dispatch(setError(true))
        dispatch(setErrorMessage("Username incorrect"))
      } else {
        dispatch(setError(true))
        dispatch(setErrorMessage("Something went wrong"))
      }
    }

    /* 
    //    if (config.dev == "true")
    fetch(`http://${config.kukaHost}:${config.kukaPort}/local/user/register`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Dev-Token":
          config.dev == "true" ? "devtoken123" : "wrongtoken",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data: RegisterResponse) => {
        console.log("Success:", data)
        if (data.ok === 0) {
          console.log("Request failed because: " + data.data.message)
          setError(true)
          setErrorMessage(data.data.message)
        } else if (data.ok === 1 && data.data.userId) {
          dispatch(setUserId(data.data.userId))
          console.log(data.data.message)
          //history.push("/profile")
        } else {
          console.log(data.data.message)
        }
      })
      .catch(error => {
        console.error("Error:", error)
      })
      */
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
