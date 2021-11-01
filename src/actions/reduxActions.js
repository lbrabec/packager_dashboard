import ActionTypes from '../constants';
import { defaultOptions } from '../reducers';
import * as R from "ramda"


export const setDashboardQuery = payload => ({
    type: ActionTypes.SET_DASHBOARD_QUERY,
    payload: payload
})

export const unsetDashboardQuery = payload => ({
    type: ActionTypes.UNSET_DASHBOARD_QUERY,
    payload: payload
})

export const loadDashboardResp = payload => ({
    type: ActionTypes.LOAD_DASHBOARD_RESP,
    payload: payload
})

export const loadDashboard = payload => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.LOAD_DASHBOARD,
        payload: payload
    });

    const URL = window.env.PACKAGER_DASHBOARD_APIv2 + payload

    fetch(URL, {credentials: 'include'})
    .then(blob => blob.json())
    .then(data => {
        dispatch(loadDashboardResp({
            forQuery: window.location.search,
            data: data
        }))
        dispatch(setServerError(false))
    })
    .catch((error) => {
        console.error('Error:', error);
        //server-side error, retry in 60s
        dispatch(setServerError(true))
        setTimeout(() => dispatch(loadDashboard(payload)), 60000)
    });

}

export const changeOption = payload => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.CHANGE_OPTION,
        payload: payload
    })

    // dashboard_query needs to be set to proper username right now
    // if not, this will cause a bug when dashboard_query === ""
    // to prevent this, dashboard shouldn't render unless the
    // username is properly set in global state
    const { dashboard_query , options } = getState()

    dispatch(saveOptions({
        dashboard_query: dashboard_query,
        options: options
    }))
}

export const changeOptionBatch = payload => (dispatch, getState) => {
    dispatch({
        type:ActionTypes.CHANGE_OPTION_BATCH,
        payload: payload
    })

    const { dashboard_query, options } = getState()

    dispatch(saveOptions({
        dashboard_query: dashboard_query,
        options: options
    }))
}

export const saveOptions = payload => dispatch => {
    dispatch({
        type: ActionTypes.SAVE_OPTIONS,
        payload: payload
    })

    localStorage.setItem('options_' + payload.dashboard_query, JSON.stringify(payload.options))
}

export const loadOptions = payload => dispatch => {
    const key = 'options_' + window.location.search
    const options = JSON.parse(localStorage.getItem(key))

    dispatch({
        type: ActionTypes.LOAD_OPTIONS,
        payload: R.mergeRight(defaultOptions, options)
    })
}

export const loadPinned = payload => dispatch => {
    const key = 'pinned_' + window.location.search
    const pinned = JSON.parse(R.defaultTo("{}", localStorage.getItem(key)))

    dispatch({
        type: ActionTypes.LOAD_PINNED,
        payload: pinned
    })
}

export const savePinned = payload => dispatch => {
    const key = 'pinned_' + payload.dashboard_query

    dispatch({
        type: ActionTypes.SAVE_PINNED,
        payload: payload
    })

    localStorage.setItem(key, JSON.stringify(payload.pinned))
}

export const handlePin = payload => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.HANDLE_PIN,
        payload: payload
    })

    const { dashboard_query, pinned } = getState()

    dispatch(savePinned({dashboard_query: dashboard_query, pinned: pinned}))
}

export const resetOptions = payload => dispatch => {
    localStorage.setItem(payload, JSON.stringify(defaultOptions))
    dispatch({
        type: ActionTypes.RESET_OPTIONS,
        payload: payload
    })
}

export const loadReleases = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_RELEASES,
        payload: payload
    })

    fetch(window.env.RELEASES_API)
    .then(blob => blob.json())
    .then(data => {
        const fedora = R.compose(
            R.map(release => `Fedora ${release}`),
            R.append("Rawhide"),
            R.dropLast(1)
        )(data.fedora.values)
        const epel = R.map(release => `EPEL ${release}`, data.epel)
        const currentFedora = R.defaultTo(data.fedora.rawhide, data.fedora.branched)
        dispatch({
            type: ActionTypes.LOAD_RELEASES_RESP,
            payload: { fedora, epel, currentFedora }
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const loadSchedule = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_SCHEDULE,
        payload: payload
    })

    fetch(window.env.LANDINGPAGE_API)
    .then(blob => blob.json())
    .then(data => {
        const schedule = data.schedule

        dispatch({
            type: ActionTypes.LOAD_SCHEDULE_RESP,
            payload: schedule
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const loadCachingInfo = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_CACHING_INFO,
        payload: payload
    })

    fetch(window.env.CACHING_INFO_API)
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.LOAD_CACHING_INFO_RESP,
            payload: data
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const throwError = payload => ({
    type: ActionTypes.THROW_ERROR,
    payload: new Error(`${payload.error} ${payload.reason}`)
})

export const setDepGraph = payload => ({
    type: ActionTypes.SET_DEP_GRAPH,
    payload: payload
})

export const setServerError = payload => ({
    type: ActionTypes.SET_SERVER_ERROR,
    payload: payload
})

export const loadEnvironment = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_ENVIRONMENT,
        payload: payload
    })

    fetch(window.env.DEPLOYMENT_ENV)
    .then(blob => blob.json())
    .then(data => {
        const deployment_env = data.deployment_env

        dispatch({
            type: ActionTypes.LOAD_ENVIRONMENT_RESP,
            payload: deployment_env
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const getVersion = payload => dispatch => {
    dispatch({
        type: ActionTypes.GET_VERSION,
        payload: payload
    })

    fetch(window.env.VERSION)
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.GET_VERSION_RESP,
            payload: data.version
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const loadServiceAlerts = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_SERVICE_ALERTS,
        payload: payload
    })

    fetch(window.env.SERVICE_MESSAGES)
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.LOAD_SERVICE_ALERTS_RESP,
            payload: data
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const loadLinkedUser = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_LINKED_USER,
        payload: payload
    })

    fetch(window.env.LINKED_USER, {credentials: 'include'})
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.LOAD_LINKED_USER_RESP,
            payload: data
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const saveToken = payload => ({
    type: ActionTypes.SAVE_TOKEN,
    payload: payload
})

export const loadPackages = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_PACKAGES,
        payload: payload
    })

    fetch(window.env.PACKAGER_DASHBOARD_API + 'all_fedora_packages')
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.LOAD_PACKAGES_RESP,
            payload: data
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const loadOnePackage = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_ONE_PACKAGE,
        payload: payload
    })

    fetch(window.env.PACKAGER_DASHBOARD_API + '/package/' + payload)
    .then(blob => blob.json())
    .then(data => {
        dispatch({
            type: ActionTypes.LOAD_ONE_PACKAGE_RESP,
            payload: data
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
