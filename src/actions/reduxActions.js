import ActionTypes from '../constants';


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

export const loadUser = payload => dispatch => {
    dispatch({
        type: ActionTypes.LOAD_USER,
        payload: payload
    });

    fetch(window.env.PACKAGER_DASHBOARD_API + payload)
    .then(blob => blob.json())
    .then(data => {
        dispatch(loadUserResp(data))

        // retry after 10s if fetched data not complete
        if(data.bzs.status !== 200 ||
           data.prs.status !== 200 ||
           data.static_info.status !== 200){
            setTimeout(() => dispatch(loadUser(payload)), 10000);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const changeOption = payload => ({
    type: ActionTypes.CHANGE_OPTION,
    payload: payload
})

