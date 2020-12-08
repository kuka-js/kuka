import React from "react"
import { useSelector } from "react-redux"
import { getNotification, getNotificationMessage } from "../app/appState"

export function NotificationMessageComponent() {
  const notification = useSelector(getNotification)
  const notificationMessage = useSelector(getNotificationMessage)
  
  if (notification) {
    return <div>{notificationMessage}</div>
  } else {
    return <div></div>
  }
}
