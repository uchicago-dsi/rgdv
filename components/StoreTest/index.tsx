"use client"
import { Provider } from "react-redux";
import { store } from "utils/state/store";

const Outer = () => {
  return <Provider store={store}>
    <StoreTest />
  </Provider>
}

const StoreTest = () => {
  // const store = useAppSelector(s => s)
  // console.log(store)
  return null
}

export default Outer