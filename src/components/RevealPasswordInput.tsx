import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import * as React from 'react'

type Props = {
  className?: string
  label?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  tabIndex?: number,
  timeout?: number,
}

type State = {
  showPassword: boolean,
}

class RevealPasswordInput extends React.Component<Props, State> {

  private mounted = false
  private timeoutToken?: number

  constructor(props: Props) {
    super(props)

    this.state = {
      showPassword: false,
    }
  }

  public componentDidMount() {
    this.mounted = true
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  public render() {
    const { tabIndex, className, onChange, value } = this.props
    const showPassword = this.state.showPassword ? 'text' : 'password'
    const label = this.props.label ? <InputLabel htmlFor="adornment-password">{this.props.label}</InputLabel> : null

    return (
      <FormControl>
        {label}
        <Input
          tabIndex={tabIndex}
          id="adornment-password"
          type={showPassword}
          value={value}
          autoComplete='off'
          onChange={onChange}
          className={className}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.toggleVisibility}
              >
                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    )
  }

  private toggleVisibility = () => {
    if (!this.state.showPassword) {
      const callback = () => {
        this.timeoutToken = window.setTimeout(() => {
          if (!this.mounted) {
            return
          }
          this.setState({
            showPassword: false,
          })
        }, this.props.timeout)
      }

      this.setState({ showPassword: true }, callback)
    } else {
      if (this.timeoutToken) {
        window.clearTimeout(this.timeoutToken)
        this.timeoutToken = undefined
      }
      this.setState({ showPassword: false })
    }
  }
}

export default RevealPasswordInput