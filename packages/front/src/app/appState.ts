import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk, RootState } from "./store"

interface AppState {
  loggedIn: boolean
  userId?: number
  username?: string
  email?: string
  isAdmin: boolean
  jwtToken?: string
  tokenExpiry?: number
  error?: boolean
  errorMessage?: string
  notification?: boolean
  notificationMessage?: string
}

const initialState: AppState = { loggedIn: false, isAdmin: false }

export const appSlice = createSlice({
  name: "AppState",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setTokenExpiry: (state, action: PayloadAction<number>) => {
      state.tokenExpiry = action.payload
    },
    setJwtToken: (state, action: PayloadAction<string>) => {
      state.jwtToken = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    },
    setNotification: (state, action: PayloadAction<boolean>) => {
      state.notification = action.payload
    },
    setNotificationMessage: (state, action: PayloadAction<string>) => {
      state.notificationMessage = action.payload
    },
  },
})

export const {
  setUserId,
  setEmail,
  setUsername,
  setJwtToken,
  setTokenExpiry,
  setLoggedIn,
  setIsAdmin,
  setError,
  setErrorMessage,
  setNotification,
  setNotificationMessage,
} = appSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const setUserIdAsync = (amount: number): AppThunk => dispatch => {
  setTimeout(() => {
    dispatch(setUserId(amount))
  }, 1000)
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getUserId = (state: RootState) => state.appState.userId
export const getEmail = (state: RootState) => state.appState.email
export const getUsername = (state: RootState) => state.appState.username
export const getJwtToken = (state: RootState) => state.appState.jwtToken
export const getTokenExpiry = (state: RootState) => state.appState.tokenExpiry
export const getLoggedIn = (state: RootState) => state.appState.loggedIn
export const getIsAdmin = (state: RootState) => state.appState.isAdmin
export const getError = (state: RootState) => state.appState.error
export const getErrorMessage = (state: RootState) => state.appState.errorMessage
export const getNotification = (state: RootState) => state.appState.notification
export const getNotificationMessage = (state: RootState) =>
  state.appState.notificationMessage

export default appSlice.reducer
