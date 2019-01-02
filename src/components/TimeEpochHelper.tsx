import { Typography } from '@material-ui/core'
import { StyleRules, Theme, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import * as moment from 'moment'
import * as React from 'react'
import { WithStyleProps } from '../@types/Styles'

type Props = {
  intervalInMin: number,
  onNewTimeEpoch: (epoch: number) => void,
} & WithStyleProps

type State = {
  epochBeginInMs: number,
  epochCount: number,
  epochEndInMs: number,
  intervalInMin: number,
  visible: boolean,
}

const styles = (theme: Theme) => ({
  input: {
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  }, text: {
    marginBottom: theme.spacing.unit,
  },
}) as StyleRules

class TimeEpochHelper extends React.Component<Props, State> {

  private oneMinuteInMilliseconds = 60 * 1000
  private timeoutToken?: number

  constructor(props: Props) {
    super(props)

    this.state = {
      epochBeginInMs: 0,
      epochCount: 0,
      epochEndInMs: 0,
      intervalInMin: props.intervalInMin,
      visible: false,
    }
  }

  public componentDidMount() {
    this.tick()
  }

  public componentWillUnmount() {
    if (this.timeoutToken) {
      window.clearTimeout(this.timeoutToken)
    }
  }

  public render() {
    const { classes } = this.props
    const { epochBeginInMs, epochEndInMs, intervalInMin, epochCount } = this.state

    const beginCurrentEpoch = moment(epochBeginInMs).format('LTS')
    const beginNextEpoch = moment(epochEndInMs).format('LTS')

    return (
      <div>
        <Typography variant="caption" className={classes.text}>Count of minute epochs from UNIX timestamp</Typography>
        <TextField type='number' label='Minutes' value={intervalInMin} onChange={this.tick} className={classes.input} />
        <Typography className={classes.text}>Count is: {epochCount}</Typography>
        <Typography className={classes.text}>Start was: {beginCurrentEpoch}</Typography>
        <Typography className={classes.text}>End will be: {beginNextEpoch}</Typography>
      </div>
    )
  }

  private tick = (event?: React.ChangeEvent<any>) => {
    clearTimeout(this.timeoutToken)

    const intervalInMs = this.state.intervalInMin * this.oneMinuteInMilliseconds

    const now = Date.now()
    const epochCount = Math.floor(now / intervalInMs)

    const epochBeginInMs = epochCount * intervalInMs
    const epochEndInMs = epochBeginInMs + intervalInMs

    const timeoutForUpdate = epochEndInMs - now

    const newState: any = {
      epochBeginInMs,
      epochCount,
      epochEndInMs,
    }

    if (event && Number(event.currentTarget.value) > 0) {
      newState.intervalInMin = Number(event.currentTarget.value)
    }

    this.setState(newState)
    this.timeoutToken = window.setTimeout(this.tick, timeoutForUpdate)
    this.props.onNewTimeEpoch(epochCount)
  }
}

export default withStyles(styles)(TimeEpochHelper)
