import {
  createContext,
  useReducer,
  useMemo,
  PropsWithChildren,
  FC,
  useCallback,
  useEffect,
} from "react";
import { produce } from "immer";
import { User } from "@/constants/types";
import { get, post } from "@/hooks/axios";

export type State = {
  user: User | null;
  expoPushToken: string | null;
  [key: string]: any;
};

export const initialState: State = {
  user: null,
  expoPushToken: null,
};

export const reducer = (
  state: State,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    default:
      return produce(state, (draft) => {
        draft[action.type] = action.payload;
      });
  }
};

export const ApplicationContext = createContext<{
  state: State;
  updateState: (type: string, payload: any) => void;
}>({
  state: initialState,
  updateState: () => {},
});

export const ApplicationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateState = useMemo(
    () => (type: string, payload: any) => dispatch({ type, payload }),
    [dispatch]
  );
  const getProfile = useCallback(async () => {
    await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
    });
  }, []);

  const saveToken = async () => {
    await post("users/registerNotification", {
      token: state.expoPushToken,
    })
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (state.expoPushToken) {
      saveToken();
    }
  }, [state.expoPushToken]);

  useEffect(() => {
    if (state.user === null) {
      getProfile();
    }
  }, [getProfile]);
  return (
    <ApplicationContext.Provider value={{ state, updateState }}>
      {children}
    </ApplicationContext.Provider>
  );
};
