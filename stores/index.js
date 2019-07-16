import { createContext } from "react";
import { observable } from 'mobx';
import { useLocalStore } from "mobx-react-lite";
import Request from "./request";

const StoreContext = createContext(null);

class Store {
  @observable request = new Request()
}

const useStore = () => {
  const store = React.useContext(storeContext);
  return store;
};

let store;
function initializeData(initialData = store || {}) {
  return initialData;
}

function InjectStoreContext({ children }) {
  const store = useLocalStore(() => (new Store()));
  return (
    <StoreContext.Provider value={store}> {children} </StoreContext.Provider>
  );
}

export { InjectStoreContext, StoreContext, initializeData, useStore };
