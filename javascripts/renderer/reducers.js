import {combineReducers} from 'redux'
import actionTypes from './action_types'

const defaultSongsList = {
  term: '',
  items: []
}
const defaultSong = {
  title: '--',
  artist: '--',
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0
}

function userData(state = {}, action) {
  return state
}

function currentSong(state = defaultSong, action) {
  switch (action.type) {
    case actionTypes.SELECT_SONG:
      return Object.assign({}, defaultSong, action.song)
    case actionTypes.PLAY:
      return Object.assign({}, state, {isPlaying: true})
    case actionTypes.PAUSE:
      return Object.assign({}, state, {isPlaying: false})
    case actionTypes.UPDATE_PROGRESS:
      return Object.assign({}, state, action.song)
    case actionTypes.SEEK:
      return Object.assign({}, state, {
        currentTime: parseInt(state.duration / 100 * action.progress)
      })
    default:
      return state
  }
}

function songsList(state = defaultSongsList, action) {
  switch (action.type) {
    case actionTypes.RECEIVE_SONGS:
      const songs = action.songs.filter((song) => {
        return song.title
      }).map((song) => {
        return action.term ? song : Object.assign({}, song, {isOwn: true})
      })
      return {
        term: action.term,
        items: songs
      }
    case actionTypes.MARK_SONG:
      if (action.action === 'add') {
        return Object.assign({}, state, {
          items: state.items.map((song) => (song.id === action.song.id) ? Object.assign({}, song, {isAdded: true}) : song)
        })
      } else {
        return Object.assign({}, state, {
          items: state.items.filter((song) => song.id !== action.song.id)
        })
      }
    default:
      return state
  }
}

function isFetching(state = false, action) {
  switch (action.type) {
    case actionTypes.START_REQUEST:
      return true
    case actionTypes.END_REQUEST:
      return false
    default:
      return state
  }
}

const appReducers = combineReducers({songsList, currentSong, userData, isFetching})

export default appReducers
