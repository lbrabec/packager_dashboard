import ActionTypes from '../constants';

export const defaultOptions = {
    show_bugs: true,
    bug_min_priority_severity: "low",
    bug_include_unspecified: true,

    show_bug_status_NEW: true,
    show_bug_status_MODIFIED: true,
    show_bug_status_ASSIGNED: true,
    show_bug_status_ON_QA: true,
    show_bug_status_ON_DEV: true,
    show_bug_status_VERIFIED: true,
    show_bug_status_POST: true,
    show_bug_status_RELEASE_PENDING: true,

    show_bug_kw_tracking: true,
    show_bug_kw_futurefeature: true,
    show_bug_kw_triaged: true,
    show_bug_kw_releasemonitoring: true,

    sort: "name",

    show_updates: true,
    show_prs: true,
    show_overrides: true,
    show_orphaned: true,
    show_koschei: true,
    show_fti: true,
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
            //drop new payload if user changed
            return action.payload.forUser === state.fasuser?
            {
                ...state,
                user_data: action.payload.data
            }
            :
            {
                ...state
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

        case ActionTypes.RESET_OPTIONS:
            return {
                ...state,
                options: defaultOptions
            }

        default:
            return state
    }
}
