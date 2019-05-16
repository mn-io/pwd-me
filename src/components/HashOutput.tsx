import IconButton from '@material-ui/core/IconButton'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import {Theme} from '@material-ui/core/styles/createMuiTheme'
import {StyleRules} from '@material-ui/core/styles/withStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import * as React from 'react'
import { IOtm } from '../@types/Config'
import { WithStyleProps } from '../@types/Styles'

type Props = {
  otm?: IOtm
  colors?: string[],
  hashes: string[][],
} & WithStyleProps

type State = {
}

const styles = (theme: Theme) => ({
  button: {
    '&:hover': {
      background: 'inherit',
    },
  },
  cell: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  cellPadding: {
    paddingLeft: theme.spacing.unit,
  },
  counter: {
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  input: {
    '& input': {
      padding: theme.spacing.unit,
    },
    '&:first-child': {
      marginRight: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
    marginRight: theme.spacing.unit,
  },
  root: {
    display: 'table',
  },
  row: {
    display: 'table-row',
  },
}) as StyleRules

const widthCache = {}

const calculateWidth = (length: number) => {
  const fromCache = widthCache[length]
  if (fromCache) {
    return fromCache
  }

  const value = length * 0.6 - Math.log(length * 2)
  widthCache[length] = value
  return value
}

class HashOutput extends React.Component<Props, State> {

  public render() {
    const rows = this.props.hashes.map((hashes, index) => this.renderRow(hashes, index))
    return (
      <div className={this.props.classes.root}>
        {rows}
      </div>
    )
  }

  private renderRow = (hashes: string[], i: number) => {
    const { classes, colors } = this.props
    const colorStyle: { color?: string } = {}
    if (colors) {
      colorStyle.color = colors[i % colors.length]
    }

    const items = hashes.map((hash, j) => {
      const width = calculateWidth(hash.length)
      return (
        <div key={hash + i + j} className={`${classes.cell} ${classes.cellPadding}`}>
          <OutlinedInput
            type='text'
            value={hash}
            readOnly={true}
            labelWidth={0}
            className={classes.input}
            onFocus={this.handleFocus}
            style={{
              width: `${width}em`,
            }}
          />
        </div>
      )
    })

    return (
      <div key={hashes[0]} className={classes.row}>
        <div className={`${classes.cell}, ${classes.counter}`}>
          {i + 1}
          <IconButton style={colorStyle} className={classes.button} onClick={this.createOtmHandler(hashes)}>
            <FiberManualRecord fontSize="small" />
          </IconButton>
        </div>
        {items}
      </div>
    )
  }

  private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.persist()
    setTimeout(() => event.target.select(), 10)
  }

  private createOtmHandler = (hashes: string[]) => {
    return () => this.otmHandler(hashes)
  }

  private otmHandler = (hashes: string[]) => {
    if (!this.props.otm) {
      return
    }

    const { uri, accessToken } = this.props.otm
    if (!uri || !accessToken) {
      return
    }

    const form = new FormData()
    form.append('accessToken', accessToken)
    form.append('payload', hashes.join('\n\n'))

    const request = new XMLHttpRequest()
    request.open('POST', uri, true)
    request.onreadystatechange = this.otmCallback(uri, request)
    request.send(form)
  }

  private otmCallback = (uri: string, request: XMLHttpRequest) => {
    return () => {
      if (request.readyState !== 4 || request.status !== 200) {
        return
      }
      console.log(`Hashes stored at ${uri}${request.response}`)
    }
  }
}

export default withStyles(styles)(HashOutput)
