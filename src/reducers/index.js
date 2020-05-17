import ActionTypes from '../constants';

const defaultState = {
    user_data: undefined,
    fasuser: "",
    options: {
        show_bugs: true,
        show_updates: true,
        show_prs: true,
        show_overrides: true,
        show_orphanned: true
    }
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                fasuser: action.payload
            }

        case ActionTypes.UNSET_USER:
            return {
                ...state,
                fasuser: ""
            }

        case ActionTypes.LOAD_USER:
            return {
                ...state,
                user_data: undefined
            }

        case ActionTypes.LOAD_USER_RESP:
            return {
                ...state,
                user_data: action.payload
            }

        case ActionTypes.CHANGE_OPTION:
            return {
                ...state,
                options: {
                    ...state.options,
                    [action.payload.name]: action.payload.value
                }
            }

        default:
            return state
    }
}
