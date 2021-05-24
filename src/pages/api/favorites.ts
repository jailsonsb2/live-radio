import {
  deleteStation,
  onError,
  onNoMatch,
  saveStation
} from 'lib/api/api-utils'
import { setupSession, validateStation } from 'lib/api/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const collectionName = 'favorites'

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupSession)
  .get(collectionName)
  .post(validateStation, saveStation(collectionName))
  .delete(deleteStation(collectionName))

export default handler
