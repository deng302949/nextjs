import { createContext } from "react";
import { observable } from 'mobx';
import { useLocalStore } from "mobx-react-lite";
import Request from "./request";
import Modal from "./modal";

const StoreContext = createContext(null);

class Store {
  @observable request = new Request()
  @observable modal = new Modal()
}

const useStore = () => {
  const store = React.useContext(StoreContext);
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

export { InjectStoreContext, StoreContext, initializeData, useStore, Store };
