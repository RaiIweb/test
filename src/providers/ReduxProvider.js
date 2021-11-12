import React  from "react";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "../reducers";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

const store = createStore(rootReducer, applyMiddleware(thunk));

export function ReduxProvider({ children }) {
  
  return <Provider store={store}>{children}</Provider>;
}
