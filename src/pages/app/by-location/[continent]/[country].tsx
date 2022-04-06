import { t, Trans } from '@lingui/macro'
import { stationSearchIndexes, userAgentName } from 'browser-config'
import { AppDefaultLayout } from 'components/layout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import getFlag from 'country-code-emoji'
import { countries } from 'generated/countries'
import {
  createStationListRow,
  dataToRadioDTO,
  RadioDTO,
  stationDataToStationModel
} from 'lib/utils/station-utils'
import {
  loadTranslations,
  paramsWithLocales
} from 'lib/utils/taranslation-utils'
import { continentsByCode } from 'lib/utils/misc-utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { useMemo } from 'react'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { revalidate } from 'server-config'

export const getStaticPaths: GetStaticPaths = async function (ctx) {
  const paths = paramsWithLocales(
    [{ country: 'RS', continent: 'EU' }],
    ctx.locales!
  )

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const translation = await loadTranslations(ctx.locale!)

  const countryCode = ctx.params?.country as string
  const continent = ctx.params?.continent as string

  const flag = getFlag(countryCode)

  const api = new RadioBrowserApi(userAgentName)
  const stationResults = await api.searchStations(
    {
      countryCode: countryCode.toUpperCase(),
      limit: 3000
    },
    undefined,
    true
  )

  return {
    props: {
      stations: dataToRadioDTO(stationResults),
      countryCode: countryCode.toUpperCase(),
      continentCode: continent.toUpperCase(),
      flag,
      translation
    },
    revalidate
  }
}

export default function CountryStations({
  stations,
  countryCode,
  continentCode,
  flag
}: {
  stations: RadioDTO[]
  countryCode: string
  continentCode: string
  flag: string
}) {
  const router = useRouter()
  const { favoriteStations } = useRootStore()

  const stationModels = useMemo(
    () => stationDataToStationModel(stations),
    [stations]
  )

  if (router.isFallback) {
    return <ListStationsFallback />
  }

  const continentName =
    continentsByCode()[
      continentCode as keyof ReturnType<typeof continentsByCode>
    ]

  const countryData = countries()[
    continentCode as keyof ReturnType<typeof countries>
  ].find((country) => country.code === countryCode)!

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-location',
      text: t`By Location`
    },
    {
      href: '/app/by-location/[continent]',
      as: `/app/by-location/${continentCode}`,
      text: `${continentName.t}`
    },
    {
      text: `${countryData.name} ${flag} `
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stationModels}
      uuid="id"
      indexes={stationSearchIndexes}
    >
      <PageTitle title={t`Search For Stations in ${countryData.name}`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow({
          showCountry: false,
          showFlag: false,
          favoriteStations
        })}
        noData={
          <Trans>
            <p>
              Currently there is no data for
              <strong> {`${countryData.name}`}</strong>.
            </p>
          </Trans>
        }
      />
    </FilterDataStoreProvider>
  )
}

CountryStations.layout = AppDefaultLayout
