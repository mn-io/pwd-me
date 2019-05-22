import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { StyleRules } from '@material-ui/core/styles/withStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import * as React from 'react'
import { WithStyleProps } from '../@types/Styles'
import emitter from '../services/Emitter'
import logger from '../services/logger/Logger'

type Props = WithStyleProps

type State = {
}

const styles = (theme: Theme) => ({
  error: {
    color: 'red',
  },
  info: {
    color: 'green',
  },
  log: {
  },
  table: {
    '-moz-user-select': 'text',
    '-ms-user-select': 'text',
    '-o-user-select': 'text',
    '-webkit-user-select': 'text',
    padding: 0,
    'user-select': 'text',
  },
  warn: {
    color: 'orange',
  },
}) as StyleRules

class LogView extends React.Component<Props, State> {

  public componentDidMount() {
    emitter.addListener(logger.EVENT_NAME, this.listener)
  }

  public componentWillUnmount() {
    emitter.removeListener(logger.EVENT_NAME, this.listener)
  }

  public render() {
    const rows = logger.getLogs()
      .map((log, index) => (
        <TableRow key={index}>
          <TableCell className={`${this.props.classes[log.channel]}, ${this.props.classes.table}`}>
            {log.messages}
          </TableCell>
        </TableRow>
      ))

    return (
      <Table>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    )
  }

  private listener = () => {
    this.forceUpdate()
  }
}

export default withStyles(styles)(LogView)
