import React, { useState } from "react"
import {
  setJwtToken,
  setTokenExpiry,
  setUsername,
  setLoggedIn,
  setError,
  setErrorMessage,
} from "../../app/appState"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import jwt_decode from "jwt-decode"
import * as config from "../../config/config.json"

interface LoginResponse {
  ok: number
  data: {
    message: string
    token: string
    tokenExpiry: number
  }
}

export function Login() {
  const [username, setInputUsername] = useState("")
  const [password, setInputPassword] = useState("")
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      username,
      password,
    }
    try {
      const submitRequest = await axios.post(
        `http://${config.kukaHost}:${config.kukaPort}/local/user/login`,
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
      dispatch(setJwtToken(submitRequest.data.data.token))
      dispatch(setTokenExpiry(submitRequest.data.data.tokenExpiry))
      interface DecodedToken {
        userId: number
      }
      const decodedToken: DecodedToken = jwt_decode(submitRequest.data.data.token)
      dispatch(setUsername(username))
      dispatch(setLoggedIn(true))
      history.push("/profile")
    } catch (e) {
      // If username not found
      if (e.response && e.response.status == 404) {
        dispatch(setError(true))
        dispatch(setErrorMessage("Username incorrect"))
      } else {
        console.log("ASDSADSADSADASDSAD")
        console.log(JSON.stringify(e, null, 2))
        console.log("ASDSADSADSADASDSAD")
        console.log(e)
        dispatch(setError(true))
        dispatch(setErrorMessage("Something went wrong"))
      }
    }
    /*
    fetch(`http://${config.kukaHost}:${config.kukaPort}/local/user/login`, {
      method: "POST", // or 'PUT'
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Dev-Token":
          config.dev == "true" ? "devtoken123" : "wrongtoken",
      },
      body: JSON.stringify(data),
    })
      .catch(error => {
        console.log("LOGIN ERROR")
        console.log(error)
        console.log("CONFIG")
        console.log(config)
      })
      .then(response => {
        console.log("RESPONSE LOGIN")
        console.log(response)
        return response.json()
      })
      .then((data: LoginResponse) => {
        console.log("Success:")
        console.log(data)
        if (data.ok === 0) {
          console.log("Request failed because: " + data.data.message)

          setError(true)
          setErrorMessage(data.data.message)
        } else if (data.ok === 1 && data.data.token) {
          dispatch(setJwtToken(data.data.token))
          dispatch(setTokenExpiry(data.data.tokenExpiry))
          interface DecodedToken {
            userId: number
          }
          const decodedToken: DecodedToken = jwt_decode(data.data.token)
          dispatch(setUserId(decodedToken.userId))
          dispatch(setLoggedIn(true))
          console.log(data.data.message)
          history.push("/profile")
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
              setInputUsername(e.target.value)
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
              setInputPassword(e.target.value)
            }}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
