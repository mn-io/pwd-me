import Paper from '@material-ui/core/Paper'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { StyleRules } from '@material-ui/core/styles/withStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as React from 'react'
import IConfig, { IProfile } from '../@types/Config'
import { WithStyleProps } from '../@types/Styles'
import { ConfigProvider } from '../services/ConfigProvider'
import emitter from '../services/Emitter'
import HashBox from '../services/HashBox'
import { Logger } from '../services/Logger'
import HashOutput from './HashOutput'
import UserInput from './UserInput'

const configUrl = 'config.json'

type Props = WithStyleProps

type State = {
  config?: IConfig,
  inputIdentifier?: string,
  inputToken?: string,
  profile?: IProfile,
  hashes?: string[][],
}

const styles = (theme: Theme) => ({
  cell: {
    display: 'table-cell',
    verticalAlign: 'top',
  },
  hashOutput: {
    marginLeft: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  root: {
    display: 'table',
    margin: 'auto',
    marginTop: theme.spacing.unit * 2,
    width: 'auto',
  },
  row: {
    display: 'table-row',
  },
  userInput: {
    padding: theme.spacing.unit * 2,
    width: 250,
  },
}) as StyleRules

class App extends React.Component<Props, State> {

  private previousInput = ''
  private previousProfile?: IProfile
  private mounted = false

  constructor(props: Props) {
    super(props)

    this.loadConfig()
    Logger.interceptConsole(emitter)
    void HashBox.selfTest()

    this.state = {}
  }

  public render() {
    const { config, hashes } = this.state
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <div className={classes.cell}>
            <Paper className={classes.userInput}>
              <UserInput config={config} onGenerateHashes={this.onGenerateHashes} />
            </Paper>
          </div>
          <div className={classes.cell}>
            {
              config && hashes &&
              <Paper className={classes.hashOutput}>
                <HashOutput colors={config.ui.colors} otm={config.otm} hashes={hashes} />
              </Paper>
            }
          </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.mounted = true
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  private loadConfig = async () => {
    const config = await ConfigProvider.loadConfig(configUrl)
    if (this.mounted) {
      this.setState({ config })
    }
  }

  private onGenerateHashes = async (profile: IProfile, inputIdentifier: string, inputToken: string, epochCount = 0): Promise<void> => {
    if (!this.state.config) {
      return
    }

    const input = `identifier=${inputIdentifier}&token=${inputToken}&epoch=${epochCount}`
    if (input === this.previousInput && profile === this.previousProfile) {
      return
    }
    this.previousInput = input
    this.previousProfile = profile

    console.log(`Generate hashes: with profile \'${profile.name}\' and identifier \'${inputIdentifier}\'`)
    const hashes = await HashBox.run(this.state.config.hashBoxConfig, profile, input)
    this.setState({ hashes })
  }
}

export default withStyles(styles)(App)
