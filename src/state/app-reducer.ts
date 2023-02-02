export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "loading" as RequestStatusType,
  error: null as null | string
};

type InitialStateType = typeof initialState;

export const appReducer = (
  state: InitialStateType = initialState,
  action: AppStatusType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export type AppStatusType = SetAppStatusType | SetAppErrorType;

type SetAppStatusType = ReturnType<typeof setAppStatusAC>;
export const setAppStatusAC = (status: RequestStatusType) => {
  return { type: "APP/SET-STATUS", status } as const;
};

type SetAppErrorType = ReturnType<typeof setAppErrorTypeAC>;
export const setAppErrorTypeAC = (error: null | string) => {
  return { type: "APP/SET-ERROR", error } as const;
};
