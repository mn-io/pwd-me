import { Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { StyleRules, Theme, withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { WithStyleProps } from '../@types/Styles'
import emitter from '../services/Emitter'
import { Logger } from '../services/Logger'

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
    emitter.addListener(Logger.EVENT_NAME, this.listener)
  }

  public componentWillUnmount() {
    emitter.removeListener(Logger.EVENT_NAME, this.listener)
  }

  public render() {
    const rows = Logger.instance.getLogs()
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