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
    try {
      const res = await get("users/profile");
      const user = res.data.data;
      updateState("user", user);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  }, []);

  const saveToken = useCallback(async () => {
    if (!state.expoPushToken || !state.user) return;

    try {
      await post("users/registerNotification", {
        token: state.expoPushToken,
      });
      console.log("Push token registered:", state.expoPushToken);
    } catch (error) {
      console.error("Token registration error:", error);
      // Retry logic
      setTimeout(saveToken, 5000);
    }
  }, [state.expoPushToken, state.user]);

  useEffect(() => {
    if (state.user === null) {
      getProfile();
    }
  }, [getProfile]);

  useEffect(() => {
    saveToken();
  }, [saveToken]);

  return (
    <ApplicationContext.Provider value={{ state, updateState }}>
      {children}
    </ApplicationContext.Provider>
  );
};
