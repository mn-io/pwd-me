import Paper from '@material-ui/core/Paper'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { StyleRules } from '@material-ui/core/styles/withStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as React from 'react'
import IConfig, { IProfile } from '../@types/Config'
import { WithStyleProps } from '../@types/Styles'
import configProvider from '../services/configProvider/ConfigProvider'
import emitter from '../services/Emitter'
import HashBox from '../services/HashBox'
import logger from '../services/logger/Logger'
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

    this.state = {}
    logger.interceptConsole(emitter)
    void this.loadConfig()
    void HashBox.selfTest()
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
    const config = await configProvider.loadConfig(configUrl)
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

    const hashes = await HashBox.run(this.state.config.hashBoxConfig, profile, input)
    await new Promise(resolve => {
      this.setState({ hashes }, resolve)
    })
    console.log(`Generated hashes: with profile \'${profile.name}\' and identifier \'${inputIdentifier}\'`)
  }
}

export default withStyles(styles)(App)
