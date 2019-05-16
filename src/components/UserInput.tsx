import { LinearProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import MenuItem from '@material-ui/core/MenuItem'
import { StyleRules, Theme, withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import { debounce } from 'lodash'
import * as React from 'react'
import IConfig, { IProfile } from '../@types/Config'
import { WithStyleProps } from '../@types/Styles'
import ConfigView from './ConfigView'
import LogView from './LogView'
import RevealPasswordInput from './RevealPasswordInput'
import TimeEpochHelper from './TimeEpochHelper'

type Props = {
  config?: IConfig
  onGenerateHashes: (profile: IProfile, inputIdentifier: string, inputToken: string, epochCount?: number) => Promise<void>,
} & WithStyleProps

type State = {
  inputIdentifier: string,
  inputProfileIndex: number,
  inputTimeEpoch: number,
  inputTokenFieldType: string,
  inputToken: string
  isAutoDestroy: boolean,
  isAutoDestroyDebounced: boolean,
  isGenerating: boolean,
  showConfig: boolean,
  showLog: boolean,
  showTimeEpochHelper: boolean,
}

const styles = (theme: Theme) => ({
  autoDestroy: {
    textAlign: 'right',
  },
  autoDestroyOff: {
    color: 'orange',
    position: 'relative',
    top: '4px',
  },
  autoDestroyOn: {
    color: 'green',
    position: 'relative',
    top: '4px',
  },
  spacingBottom: {
    marginBottom: theme.spacing.unit * 2,
  },
}) as StyleRules

class UserInput extends React.Component<Props, State> {

  private hasGeneratedHashes = false

  private autoDestroy = debounce(() => location.reload(), 45000)

  constructor(props: Props) {
    super(props)
    this.state = {
      inputIdentifier: '',
      inputProfileIndex: 0,
      inputTimeEpoch: 0,
      inputToken: '',
      inputTokenFieldType: 'password',
      isAutoDestroy: true,
      isAutoDestroyDebounced: false,
      isGenerating: false,
      showConfig: false,
      showLog: false,
      showTimeEpochHelper: false,
    }
  }

  public render() {
    const { classes, config } = this.props
    const { isGenerating } = this.state

    const profiles = (config && config.profiles) || []
    const profileOptions = profiles.map((profile, index) => {
      return (
        <MenuItem key={index} value={index}>
          {profile.name}
        </MenuItem>
      )
    })

    return (<form onSubmit={this.submitForm}>
      <Typography variant="h5" align="center" className={classes.spacingBottom}>
        key derivator
      </Typography>

      {!config &&
        <LinearProgress variant="query" />
      }

      {config &&
        <FormGroup>
          <RevealPasswordInput
            label={'Token'}
            tabIndex={1}
            timeout={15000}
            value={this.state.inputToken}
            onChange={this.handleInputTokenChange}
            className={classes.spacingBottom}
          />

          <TextField
            label='Identifier'
            onChange={this.handleInputIdentifierChange}
            tabIndex={2}
            inputProps={{autocorrect: 'off', autocapitalize: 'off'}}
            className={classes.spacingBottom}
          />

          <TextField
            select={true}
            label={'Profile'}
            onChange={this.changeInputProfileIndex}
            value={this.state.inputProfileIndex}
            tabIndex={3}
            className={classes.spacingBottom}
          >
            {profileOptions}
          </TextField>

          <Button
            type='submit'
            variant="outlined"
            onClick={this.submitForm}
            tabIndex={4}
            className={classes.spacingBottom}>
            {isGenerating ? 'is generating' : 'generate'}
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={this.state.showConfig}
                onChange={this.toggleConfig}
                color="primary"
              />
            }
            label="show config"
          />

          {this.state.showConfig && <ConfigView profile={config.profiles[this.state.inputProfileIndex]} hashBoxConfig={config.hashBoxConfig} />}

          <FormControlLabel
            control={
              <Switch
                checked={this.state.showLog}
                onChange={this.toggleLog}
                color="primary"
              />
            }
            label="show log"
          />

          {this.state.showLog && <LogView />}

          <FormControlLabel
            control={
              <Switch
                checked={this.state.isAutoDestroy}
                onChange={this.toggleAutoDestroy}
                color="primary"
              />
            }
            label="reload page after 45 sec"
          />

          {this.state.isAutoDestroy &&
            <Typography variant="caption" className={classes.autoDestroy}>
              <FiberManualRecord fontSize="small" className={this.state.isAutoDestroyDebounced ? classes.autoDestroyOn : classes.autoDestroyOff} />
              {this.state.isAutoDestroyDebounced ? 'running' : 'not running'}
            </Typography>
          }

          <FormControlLabel
            control={
              <Switch
                checked={this.state.showTimeEpochHelper}
                onChange={this.toggleTimeEpochHelper}
                color="primary"
              />
            }
            label="time epoch helper"
          />

          {this.state.showTimeEpochHelper && <TimeEpochHelper intervalInMin={3} onNewTimeEpoch={this.setTimeEpoch} />}
        </FormGroup>
      }
    </form>
    )
  }

  private submitForm = (event: React.MouseEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    this.setState({ isGenerating: true }, this.generateHashes)
  }

  private generateHashes = async () => {
    const { config, onGenerateHashes } = this.props
    if (!config) {
      return
    }

    const profile = config.profiles[this.state.inputProfileIndex]
    const { inputIdentifier, inputToken, inputTimeEpoch } = this.state

    this.hasGeneratedHashes = true
    this.startAutoDestroy()
    await onGenerateHashes(profile, inputIdentifier, inputToken, inputTimeEpoch)
    this.setState({ isGenerating: false })
  }

  private toggleAutoDestroy = () => {
    const isEnabled = !this.state.isAutoDestroy
    this.setState({
      isAutoDestroy: isEnabled,
    }, () => {
      if (!isEnabled) {
        this.cancelAutoDestroy()
        return
      }

      if (this.hasGeneratedHashes) {
        this.startAutoDestroy()
      }
    })
  }

  private startAutoDestroy = () => {
    if (this.state.isAutoDestroy) {
      this.autoDestroy()
      this.setState({ isAutoDestroyDebounced: true })
    }
  }

  private cancelAutoDestroy = () => {
    this.autoDestroy.cancel()
    this.setState({ isAutoDestroyDebounced: false })
  }

  private handleInputTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputToken = event.target.value
    this.setState({ inputToken })
    this.cancelAutoDestroy()
  }

  private handleInputIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputIdentifier = event.target.value
    this.setState({ inputIdentifier })
    this.cancelAutoDestroy()
  }

  private setTimeEpoch = (inputTimeEpoch: number) => {
    this.setState({ inputTimeEpoch })

    if (this.hasGeneratedHashes) {
      this.generateHashes()
    }
    this.cancelAutoDestroy()
  }

  private changeInputProfileIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputProfileIndex = Number(event.target.value)
    this.setState({ inputProfileIndex })
    this.cancelAutoDestroy()
  }

  private toggleConfig = () => {
    this.setState({ showConfig: !this.state.showConfig })
  }

  private toggleLog = () => {
    this.setState({ showLog: !this.state.showLog })
  }

  private toggleTimeEpochHelper = () => {
    this.setState({ showTimeEpochHelper: !this.state.showTimeEpochHelper })
  }
}

export default withStyles(styles)(UserInput)
