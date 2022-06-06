import {
  ApiContext,
  ApiState,
  checkSession
} from 'lib/server/api/shared-middleware'
import {
  bulkStationInfo,
  checkCollectionExists,
  customSearch,
  deleteStation,
  saveStation,
  songInfo,
  stationClick,
  stationInfo,
  validateStation
} from 'lib/server/api/station/middleware'
import { Router } from 'nextjs-koa-api'

export const station = new Router<ApiState, ApiContext>()
  .get('/', stationInfo)
  .post('/', checkSession, checkCollectionExists, validateStation, saveStation)
  .delete('/', checkSession, checkCollectionExists, deleteStation)
  .get('/song-info', songInfo)
  .post('/bulk-info', bulkStationInfo)
  .post('/click', stationClick)
  .post('/search', customSearch)
