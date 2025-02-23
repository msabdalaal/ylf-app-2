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
import { get } from "@/hooks/axios";

export type State = {
  user: User | null;
  [key: string]: any;
};

export const initialState: State = {
  user: null,
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
