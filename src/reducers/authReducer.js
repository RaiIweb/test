import { USER_LOGIN, USER_LOGOUT } from "../actions";


const INITIAL_STATE = { userLoggedIn: false }

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN: {
            return {
                ...state,
                userLoggedIn: true,

            }
        }
        case USER_LOGOUT: {
            return INITIAL_STATE;
        }
        
        default: {
            return state;
        }
    }

}



export default authReducer;