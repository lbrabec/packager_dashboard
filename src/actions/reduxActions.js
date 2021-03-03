import ActionTypes from '../constants';
import { defaultOptions } from '../reducers';
import * as R from "ramda"


export const setUser = payload => ({
    type: ActionTypes.SET_USER,
    payload: payload
})

export const unsetUser = payload => ({
    type: ActionTypes.UNSET_USER,
    payload: payload
})

export const loadUserResp = payload => ({
    type: ActionTypes.LOAD_USER_RESP,
    payload: payload
})

export const loadUser = payload => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.LOAD_USER,
        payload: payload
    });

    fetch(window.env.PACKAGER_DASHBOARD_API + payload)
    .then(blob => blob.json())
    .then(data => {
        dispatch(loadUserResp({
            forUser: payload,
            data: data
        }))
        dispatch(setServerError(false))

        // retry after 10s if fetched data not complete
        // and user has not changed meanwhile
        if(getState().fasuser === payload &&
           (data.bzs.status !== 200 ||
            data.prs.status !== 200 ||
            data.static_info.status !== 200)){
            setTimeout(() => dispatch(loadUser(payload)), 10000);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        //dispatch(throwError({error: error, reason: ActionTypes.LOAD_USER}))
        //server-side error, retry in 60s
        dispatch(setServerError(true))
        setTimeout(() => dispatch(loadUser(payload)), 60000)
    });
}

export const changeOption = payload => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.CHANGE_OPTION,
        payload: payload
    })

    // fasuser needs to be set to proper username right now
    // if not, this will cause a bug when fasuser === ""
    // to prevent this, dashboard shouldn't render unless the
    // username is properly set in global state
    const { fasuser , options } = getState()

    dispatch(saveOptions({
        fasuser: fasuser,
        options: options
    }))
}

export const changeOptionBatch = payload => (dispatch, getState) => {
    dispatch({
        type:ActionTypes.CHANGE_OPTION_BATCH,
        payload: payload
    })

    const { fasuser, options } = getState()

    dispatch(saveOptions({
        fasuser: fasuser,
        options: options
    }))
}

export const saveOptions = payload => dispatch => {
    dispatch({
        type: ActionTypes.SAVE_OPTIONS,
        payload: payload
    })

    localStorage.setItem(payload.fasuser, JSON.stringify(payload.options))
}

export const loadOptions = payload => dispatch => {
    const options = JSON.parse(localStorage.getItem(payload))

    dispatch({
        type: ActionTypes.LOAD_OPTIONS,
        payload: R.mergeRight(defaultOptions, options)
    })
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
