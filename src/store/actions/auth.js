// TYPES
export const LOGIN = 'LOGIN'

export const login = (token, name) => {
    return (dispatch) => {
        dispatch({ type: LOGIN, token, name })
    }
}