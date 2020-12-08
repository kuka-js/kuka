import React from "react"

type MyProps = {}
type MyState = {todos: todo[]}
type todo = {userId: number; id: number; title: string; body: string}

export class Todos extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props)
    this.state = {todos: []}
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => this.setState({todos: json}))
  }

  handleClick() {}

  render() {
    return (
      <div>
        Todosasdasdsa
        {/* <button onClick={handleClick}>Click me</button> */}
        <ul>
          {this.state.todos.map((el) => (
            <li>
              {el.title}: {el.body}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
