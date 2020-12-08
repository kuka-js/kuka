import React from "react"
import {useDispatch} from "react-redux"
import {setUserId} from "../../app/appState"

type MyProps = {}
type MyState = {
  register: {username?: string; email?: string; password?: string}
  error: boolean
  errorMessage?: string
}

interface IMyState {
  register: {username?: string; email?: string; password?: string}
  error: boolean
  errorMessage?: string
}

interface RegisterResponse {
  ok: number
  data: {
    message: string
    userId?: number
  }
}

// function useUpdateUserId(userId: number) {
//   dispatch(setUserId(data.data.userId))
//   return <div />
// }

export class Register extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props)
    this.state = {
      register: {username: "", email: "", password: ""},
      error: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event: any) {
    let newState: IMyState = this.state

    switch (event.target.name) {
      case "username":
        newState.register.username = event.target.value
        this.setState(newState)
        break
      case "email":
        newState.register.email = event.target.value
        this.setState(newState)
        break
      case "password":
        newState.register.password = event.target.value
        this.setState(newState)
        break
      default:
    }
  }

  handleSubmit(event: any) {
    event.preventDefault()
    const dispatch = useDispatch()

    console.log(JSON.stringify(this.state))

    const data = {
      username: this.state.register.username,
      email: this.state.register.email,
      password: this.state.register.password,
    }

    fetch("http://localhost:4000/local/user/register", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data: RegisterResponse) => {
        console.log("Success:", data)
        if (data.ok === 0) {
          console.log("Request failed because: " + data.data.message)

          let newState: IMyState = this.state
          newState.error = true
          newState.errorMessage = data.data.message
          this.setState(newState)
        } else if (data.ok === 1 && data.data.userId) {
          // useUpdateUserId(data.data.userId)
          console.log(data.data.message)
        } else {
          console.log(data.data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  render() {
    let errorMessage
    if (this.state.error) {
      errorMessage = this.state.errorMessage
    }

    return (
      <div>
        {errorMessage}
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={this.state.register.username}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={this.state.register.email}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={this.state.register.password}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}
