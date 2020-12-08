import React from "react"
import { useSelector } from "react-redux"
import { getError, getErrorMessage } from "../app/appState"

export function ErrorMessageComponent() {
  const error = useSelector(getError)
  const errorMessage = useSelector(getErrorMessage)

  if (error) {
    return <div>{errorMessage}</div>
  } else {
    return <div></div>
  }
}
