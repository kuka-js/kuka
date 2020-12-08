import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getJwtToken, getUsername, setIsAdmin } from "../../app/appState"
import * as config from "../../config/config.json"
import axios from "axios"

interface ProfileProps {
  successMessage: string
}

interface UserInfoResponse {
  ok: number
  data: {
    message: string
    users: {
      userId: number
      username: string
      scopes: string[]
    }
  }
}

export function Profile(props: ProfileProps) {
  const jwtToken = useSelector(getJwtToken) as string
  const username = useSelector(getUsername) as string
  const [scopes, setScopes] = useState("")
  const dispatch = useDispatch()

  if (props && props.successMessage) {
  }

  useEffect(() => {
    console.log("mount it!")
    if (username && jwtToken) {
      axios
        .get(`http://${config.kukaHost}:${config.kukaPort}/local/user`, {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Username": username,
            "X-Custom-Dev-Token":
              config.dev == "true" ? "devtoken123" : "wrongtoken",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then(result => {
          console.log("getUserInfo result")
          console.log(JSON.stringify(result, null, 2))
        })
        .catch(e => {
          console.log("getUserInfo catch")
          console.log(JSON.stringify(e, null, 2))
        })
      //        setScopes(JSON.stringify(result.data.users.scopes))
    }
  }, [])

  let scopeString = ""
  let adminMessage = ""
  if (scopes) {
    for (let item of JSON.parse(scopes)) {
      scopeString += " " + item
      if (item === "root") {
        dispatch(setIsAdmin(true))
        adminMessage = "You are admin."
      }
    }
  }

  return (
    <div>
      <div>{scopeString}</div>You are now supposedly logged in.{adminMessage}
    </div>
  )
}
