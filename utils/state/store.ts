import { configureStore } from "@reduxjs/toolkit"
import mapReducer from "./map"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { mapDataMiddleware } from "./middleware"

export const store = configureStore({
  reducer: {
    map: mapReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(mapDataMiddleware.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch