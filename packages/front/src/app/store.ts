import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit"
import appReducer from "./appState"
export const store = configureStore({
  reducer: {
    appState: appReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
