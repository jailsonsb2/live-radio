import { AuthService } from 'lib/services/auth-service'
import { RadioStation } from 'lib/station-utils'
import { client } from 'lib/utils'
import { LocalStorage } from './local-storage-service'
import { RemoteStorage } from './remote-storage-service'

let instance: AppStorage

export type AppStorageService = {
  getFavoriteStations(): Promise<RadioStation[]>
  addFavoriteStation(station: RadioStation): Promise<any>
  removeFavoriteStation(id: string): Promise<any>
  getRecentStations(): Promise<RadioStation[]>
  addRecentStation(station: RadioStation): Promise<any>
  removeRecentStation(id: string): Promise<any>
}

export function appStorageFactory() {
  const isSSR = typeof window === 'undefined'
  // const transport = isSSR ? fetch : fetch.bind(window)

  if (isSSR || !instance) {
    instance = new AppStorage(
      new LocalStorage('LiveRadio'),
      new RemoteStorage(client),
      new AuthService()
    )
  }

  return instance
}

//todo - cache and retry failed storage calls

export class AppStorage {
  private static instance: AppStorage

  constructor(
    protected local: LocalStorage,
    protected remote: RemoteStorage,
    protected authService: AuthService
  ) {}

  protected async handleStorageCall<TData = any>(
    storageCall: Promise<TData>
  ): Promise<TData> {
    //todo - normalize errors between different storage providers
    return await storageCall
  }

  protected async resolveStorage() {
    const authenticated = await this.authService.isAuthenticated()
    if (authenticated) {
      return this.remote
    } else {
      return this.local
    }
  }

  async getFavoriteStations(): Promise<RadioStation[]> {
    const storage = await this.resolveStorage()

    return storage.getFavoriteStations()
  }

  async addFavoriteStation(station: RadioStation) {
    const storage = await this.resolveStorage()

    return storage.addFavoriteStation(station)
  }

  async removeFavoriteStation(id: string) {
    const storage = await this.resolveStorage()

    return storage.removeFavoriteStation(id)
  }

  async getRecentStations() {
    const storage = await this.resolveStorage()

    return storage.getRecentStations()
  }

  async addRecentStation(station: RadioStation) {
    const storage = await this.resolveStorage()

    return storage.addRecentStation(station)
  }

  async removeRecentStation(id: string) {
    const storage = await this.resolveStorage()

    return storage.removeRecentStation(id)
  }
}
