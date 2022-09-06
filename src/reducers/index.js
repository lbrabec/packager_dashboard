import ActionTypes from '../constants';
import * as R from 'ramda';

export const defaultOptions = {
    show_schedule: true,
    show_calendars: true,
    show_bugs: true,
    show_cves_only: false,
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
    show_bug_kw: {},

    sort: "name",

    show_updates: true,
    show_prs: true,
    show_overrides: true,
    show_orphaned: true,
    show_koschei: true,
    show_fti: true,
    show_groups: {},
    show_releases: {},
    show_abrt_reports: true,
    show_groups_only: false,
}

// placeholder for now, but in the future
// default options won't necessarily mean "show all"
export const showAllOptions = defaultOptions

const defaultState = {
    dashboard_query: "",
    dashboard_data: undefined,
    linked_user: {
        is_authenticated: false,
        user: '',
        fas_groups: [],
    },
    token: '',
    options: defaultOptions,
    pinned: {},
    releases: {
        fedora: [],
        epel: [],
        currentFedora: 0,
        branched_frozen: false,
    },
    schedule: [],
    caching_info: {
        visits_required_every_n_days: 0,
    },
    error: undefined,
    server_error: false,
    depGraph: {nodes: [], edges: []},
    environment: "prod",
    version: {
        active: 0,
        latest: 0
    },
    service_messages: [],
    all_fedora_packages: [],
    one_package: undefined,
}


export default (state = defaultState, action) => {
    switch (action.type) {
        case ActionTypes.SET_DASHBOARD_QUERY:
            return {
                ...state,
                dashboard_query: action.payload
            }

        case ActionTypes.UNSET_DASHBOARD_QUERY:
            return defaultState

        case ActionTypes.LOAD_DASHBOARD_RESP:
            //drop new payload if user changed
            return action.payload.forQuery === state.dashboard_query?
            {
                ...state,
                dashboard_data: action.payload.data
            }
            :
            {
                ...state
            }

        case ActionTypes.CHANGE_OPTION:
            switch(action.payload.type){
                case 'general':
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            [action.payload.name]: action.payload.value
                        }
                    }

                case 'group':
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            show_groups: {
                                ...state.options.show_groups,
                                [action.payload.name]: action.payload.value
                            }
                        }
                    }

                case 'release':
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            show_releases: {
                                ...state.options.show_releases,
                                [action.payload.name]: action.payload.value
                            }
                        }
                    }

                case 'bug_kw':
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            show_bug_kw: {
                                ...state.options.show_bug_kw,
                                [action.payload.name]: action.payload.value
                            }
                        }
                    }

                default:
                    return state
            }

        case ActionTypes.CHANGE_OPTION_BATCH:
            return {
                ...state,
                options: R.mergeRight(state.options, action.payload)
            }

        case ActionTypes.LOAD_OPTIONS:
            return {
                ...state,
                options: action.payload === null? defaultOptions : action.payload
            }

        case ActionTypes.LOAD_PINNED:
            return {
                ...state,
                pinned: action.payload
            }

        case ActionTypes.HANDLE_PIN:
            return {
                ...state,
                pinned: {
                    ...state.pinned,
                    [action.payload.title]: action.payload.priority
                }

            }

        case ActionTypes.RESET_OPTIONS:
            return {
                ...state,
                options: defaultOptions
            }

        case ActionTypes.LOAD_RELEASES_RESP:
            return {
                ...state,
                releases: action.payload
            }

        case ActionTypes.LOAD_SCHEDULE_RESP:
            return {
                ...state,
                schedule: action.payload
            }

        case ActionTypes.LOAD_CACHING_INFO_RESP:
            return {
                ...state,
                caching_info: action.payload
            }

        case ActionTypes.THROW_ERROR:
            return {
                ...state,
                error: action.payload
            }

        case ActionTypes.SET_DEP_GRAPH:
            return {
                ...state,
                depGraph: action.payload
            }

        case ActionTypes.SET_SERVER_ERROR:
            return {
                ...state,
                server_error: action.payload
            }

        case ActionTypes.LOAD_ENVIRONMENT_RESP:
            return {
                ...state,
                environment: action.payload
            }

        case ActionTypes.GET_VERSION_RESP:
            return {
                ...state,
                version: state.version.active === 0? {
                    active: action.payload,
                    latest: action.payload
                }:{
                    ...state.version,
                    latest: action.payload
                }
            }

        case ActionTypes.LOAD_SERVICE_ALERTS_RESP:
            return {
                ...state,
                service_messages: action.payload
            }

        case ActionTypes.LOAD_LINKED_USER_RESP:
            return {
                ...state,
                linked_user: action.payload
            }


        case ActionTypes.SAVE_TOKEN:
            return {
                ...state,
                token: action.payload
            }

        case ActionTypes.LOAD_PACKAGES_RESP:
            return {
                ...state,
                all_fedora_packages: action.payload
            }

        case ActionTypes.LOAD_PACKAGERS_RESP:
            return {
                ...state,
                all_fedora_packagers: action.payload
            }

        case ActionTypes.LOAD_GROUPS_RESP:
            return {
                ...state,
                all_fedora_groups: action.payload
            }

        case ActionTypes.LOAD_ONE_PACKAGE_RESP:
            return {
                ...state,
                one_package: action.payload
            }


        default:
            return state
    }
}
