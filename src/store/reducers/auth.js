// import actions
import { LOGIN } from '../actions/auth';

const initialState = {
    accessToken: null,
    authenticated: null,
    name: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {...state, accessToken: action.token, name: action.name, authenticated: true }
        default:
            return state
    }
}

export default authReducer;