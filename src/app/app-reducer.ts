export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'APP/SET-ERROR':
            return { ...state, error: action.error }
        default:
            return state
    }
}

export const setStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const)
export const setErrorAC = (error: null | string) => ({ type: 'APP/SET-ERROR', error } as const)

export type SetStatusACType = ReturnType<typeof setStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>
type ActionsType = SetStatusACType | SetErrorACType