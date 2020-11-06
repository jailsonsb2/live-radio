import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { countryDataByKey } from 'lib/utils'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTitle: {
      textAlign: 'center'
    },
    flag: {
      color: '#000000'
    }
  })
})

const queryProgressText = 'Determinig your location'
const queryErrorText = "Sorry, couldn't get your location"
const querySuccessText = 'Your location is '

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error()
    }
  })

export function LocationModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const classes = useStyles()
  const router = useRouter()

  const { data, error } = useSWR<{ country: string; status: string }>(
    open ? '/api/locationinfo' : null,
    fetcher,
    { shouldRetryOnError: false }
  )

  const countryData = useMemo(() => {
    if (data?.country) {
      const countryData = countryDataByKey('name', data.country)

      if (countryData) {
        return {
          link: {
            href: 'search/by-location/[continent]/country/[country]',
            as: `search/by-location/${countryData.cont}/country/${countryData.code}`
          },
          flag: countryData.flag,
          country: data.country
        }
      }
    }
  }, [data])

  const goToBrowseByLocation = () => {
    router.push('browse/by-location')
  }

  const goToCountryStations = () => {
    router.push(countryData!.link.href, countryData!.link.as)
  }

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {countryData
          ? querySuccessText
          : error
          ? queryErrorText
          : queryProgressText}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          {countryData ? (
            <Typography component="h3" variant="h3" color="textPrimary">
              <span className={classes.flag}>{countryData.flag}</span>
              {countryData.country}
            </Typography>
          ) : !error ? (
            <CircularProgress />
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {error ? (
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        ) : null}
        {countryData || error ? (
          <>
            <Button onClick={goToBrowseByLocation} color="primary">
              {countryData
                ? 'Let me choose different location'
                : 'Let me choose the location'}
            </Button>
          </>
        ) : null}
        {countryData ? (
          <Button onClick={goToCountryStations} color="primary" autoFocus>
            {"Okay, let's go"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
