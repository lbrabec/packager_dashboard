import ActionTypes from '../constants';

const defaultOptions = {
    show_bugs: true,
    bug_min_severity: "low",
    bug_include_unspecified: true,

    show_updates: true,
    show_prs: true,
    show_overrides: true,
    show_orphaned: true,
    show_koschei: true,
    show_groups: {}
}

const defaultState = {
    user_data: undefined,
    fasuser: "",
    options: defaultOptions
}


export default (state = defaultState, action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                fasuser: action.payload
            }

        case ActionTypes.UNSET_USER:
            return defaultState

        case ActionTypes.LOAD_USER:
            return {
                ...state,
                //user_data: undefined
            }

        case ActionTypes.LOAD_USER_RESP:
            return {
                ...state,
                user_data: action.payload
            }

        case ActionTypes.CHANGE_OPTION:
            return action.payload.group?
            {
                ...state,
                options: {
                    ...state.options,
                    show_groups: {
                        ...state.options.show_groups,
                        [action.payload.name]: action.payload.value
                    }
                }
            }
            :
            {
                ...state,
                options: {
                    ...state.options,
                    [action.payload.name]: action.payload.value
                }
            }

        case ActionTypes.LOAD_OPTIONS:
            return {
                ...state,
                options: action.payload === null? defaultOptions : action.payload
            }

        default:
            return state
    }
}
