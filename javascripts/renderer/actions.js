import querystring from 'querystring'
import actionTypes from './action_types'

const VK_API_URL = 'https://api.vk.com/method/'
const VK_API_VERSION = '5.37'

export function play() {
  return {
    type: actionTypes.PLAY,
    isPlaying: true
  }
}

export function pause() {
  return {
    type: actionTypes.PAUSE,
    isPlaying: false
  }
}

export function selectSong(song) {
  return {
    type: actionTypes.SELECT_SONG,
    song
  }
}

export function updateProgress(song) {
  return {
    type: actionTypes.UPDATE_PROGRESS,
    song
  }
}

export function startRequest() {
  return {
    type: actionTypes.START_REQUEST
  }
}

export function endRequest() {
  return {
    type: actionTypes.END_REQUEST
  }
}


export function receiveSongs(songs) {
  return {
    type: actionTypes.RECEIVE_SONGS,
    songs
  }
}

export function fetchSongs(value) {
  return function (dispatch, getState) {
    const method = value ? '/audio.search?' : '/audio.get?'
    const params = querystring.stringify({
      q: value,
      access_token: getState().userData.access_token,
      v: VK_API_VERSION
    })

    const url = VK_API_URL + method + params

    // TODO mb generalize setting a loading state and reuse for other events
    dispatch(startRequest())

    return fetch(url)
      .then(ret => ret.json())
      .then(json => {
        dispatch(endRequest())

        if (json.response) {

          dispatch(receiveSongs(json.response.items))
        } else {
          // TODO implement errors
          // dispatch(showNetworkError())
        }
      })
  }
}

export function markSongAsAdded(song) {
  console.log(song)
  return {
    type: actionTypes.MARK_SONG_AS_ADDED,
    song
  }
}

export function addSong(song) {
  return function (dispatch, getState) {
    const params = querystring.stringify({
      owner_id: song.owner_id,
      audio_id: song.id,
      access_token: getState().userData.access_token,
      v: VK_API_VERSION
    })

    const url = VK_API_URL + '/audio.add?' + params

    dispatch(startRequest())

    return fetch(url)
      .then(ret => ret.json())
      .then(json => {
        dispatch(endRequest())

        if (json.response) {
          dispatch(markSongAsAdded(song))
        } else {
          // TODO implement errors
          // dispatch(showNetworkError())
        }
      })
  }
}
