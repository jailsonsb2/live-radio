import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { languages } from 'generated/languages'
import { getStaticTranslations } from 'initTranslations'
import { useRouter } from 'next/router'

export { getStaticTranslations as getStaticProps }

export default function LanguageList() {
  const router = useRouter()
  const langs = languages()

  const languageSearch = langs.map((language) => {
    return {
      language: language.t,
      raw: language.raw
    }
  })

  const languageDataRow = function (
    languages: { language: string; raw: string }[]
  ) {
    return function LanguageRow(index: number) {
      const { language, raw } = languages[index]

      return (
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[raw]`
            },
            as: {
              pathname: `${router.pathname}/${raw.replace(/\s/g, '-')}`
            }
          }}
          primary={language}
        />
      )
    }
  }

  const breadcrumbs = [
    {
      href: '/app/search',
      text: t`Search`
    },
    {
      href: '/app/search/by-language',
      text: t`By Language`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={languageSearch}
      uuid="language"
      indexes={['language']}
    >
      <PageTitle title={t`Search For Stations by Language`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={languageDataRow}
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

LanguageList.layout = AppDefaultLayout
