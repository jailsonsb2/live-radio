import { useRouter } from 'next/router'
import { AppMenuItem } from 'components/navigation/desktop/MenuItem'

export function LanguageDataRow({
  data
}: {
  data: { language: string; raw: string }
}) {
  const router = useRouter()

  return (
    <AppMenuItem
      link={{
        prefetch: false,
        href: {
          pathname: `${router.pathname}/[language]`
        },
        as: {
          pathname: `${router.pathname}/${data.raw.replace(/\s/g, '-')}`
        }
      }}
      primary={data.language}
    />
  )
}
