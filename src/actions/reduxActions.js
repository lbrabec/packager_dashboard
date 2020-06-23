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
        dispatch(throwError({error: error, reason: ActionTypes.LOAD_USER}))
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

        dispatch({
            type: ActionTypes.LOAD_RELEASES_RESP,
            payload: { fedora, epel }
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
