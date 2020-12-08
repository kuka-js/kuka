import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {getJwtToken, getIsAdmin} from "../../app/appState"
import {KukaClient, KukaRequest, Method} from "../../service/KukaClient"

interface UserData {
  userId: number
  username: string
  scopes: string[]
  isLocked?: string
}
interface UserListResponse {
  ok: number
  data: {
    message: string
    users: UserData[]
  }
}

interface UserDataProps {
  key: string
  userData: UserData
}

async function getUserList(token: string) {
  const requestData: KukaRequest = {
    path: "user/list",
    method: Method.GET,
    token,
  }
  return KukaClient.request(requestData)
}

async function lockUserRequest(token: string) {
  const requestData: KukaRequest = {
    path: "user/lock",
    method: Method.PUT,
    token,
  }
  return KukaClient.request(requestData)
}
function User(props: UserDataProps) {
  const userData: UserData = props.userData
  let scopesString = userData.scopes.join(", ")
  return (
    <div>
      <div>User ID: {userData.userId}</div>
      <div>Username: {userData.username}</div>
      <div>Scopes: {scopesString}</div>
      <div>Is locked?: {userData.isLocked}</div>
      <LockButton isLocked={userData.isLocked} userId={userData.userId} />
      <br />
    </div>
  )
}
interface LockButtonProps {
  userId: number
  isLocked?: string
}
function LockButton(props: LockButtonProps) {
  if (props.isLocked === "true") {
    return (
      <div>
        <button
          type="submit"
          name="userId"
          value={props.userId}
          onClick={unlockUser}
        >
          Unlock
        </button>
      </div>
    )
  } else if (props.isLocked === "false") {
    return (
      <div>
        <button type="submit" name="userId" value={props.userId}>
          Lock
        </button>
      </div>
    )
  } else {
    return <div></div>
  }
}

function unlockUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  event.preventDefault()
  console.log(event)
  console.log(event.target)
}

function lockUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  event.preventDefault()
  console.log(event)
  console.log(event.target)
}
export function GetUser() {
  const jwtToken = useSelector(getJwtToken) as string
  const isAdmin = useSelector(getIsAdmin)
  const [userData, setUserData] = useState("")

  useEffect(() => {
    if (jwtToken && isAdmin) {
      getUserList(jwtToken).then((result: UserListResponse) => {
        console.log("getUserList result")
        console.log(JSON.stringify(result))
        setUserData(JSON.stringify(result))
      })
    }
  })

  const generateUserList = (userDataList: UserData[]) => {
    var rows = []

    let i = 0
    for (let userData of userDataList) {
      rows.push(<User key={"userData" + i} userData={userData} />)
      i++
    }
    return rows
  }
  let userList
  if (userData) {
    const userListResponse: UserListResponse = JSON.parse(
      userData
    ) as UserListResponse
    userList = generateUserList(userListResponse.data.users)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(event.target)
  }

  return (
    <div>
      <form>{userList}</form>
      {/* <form onSubmit={handleSubmit}>{userList}</form> */}
    </div>
  )
}
