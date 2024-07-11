import { merge } from 'lodash';
import { alpha } from '@mui/material/styles';

function Checkbox(theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary[300]
        }
      }
    }
  };
}

function IconButton(theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4
        },
        sizeLarge: {
          width: theme.spacing(5.5),
          height: theme.spacing(5.5),
          fontSize: '1.25rem'
        },
        sizeMedium: {
          width: theme.spacing(4.5),
          height: theme.spacing(4.5),
          fontSize: '1rem'
        },
        sizeSmall: {
          width: theme.spacing(3.75),
          height: theme.spacing(3.75),
          fontSize: '0.75rem'
        }
      }
    }
  };
}

function Button(theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400
        },
        contained: {
          ...disabledStyle
        },
        outlined: {
          ...disabledStyle
        }
      }
    }
  };
}

function Typography() {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 12
        }
      }
    }
  };
}

function Chip(theme) {
  return {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:active': {
            boxShadow: 'none'
          }
        },
        sizeLarge: {
          fontSize: '1rem',
          height: 40
        },
        light: {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter,
          borderColor: theme.palette.primary.light,
          '&.MuiChip-lightError': {
            color: theme.palette.error.main,
            backgroundColor: theme.palette.error.lighter,
            borderColor: theme.palette.error.light
          },
          '&.MuiChip-lightSuccess': {
            color: theme.palette.success.main,
            backgroundColor: theme.palette.success.lighter,
            borderColor: theme.palette.success.light
          },
          '&.MuiChip-lightWarning': {
            color: theme.palette.warning.main,
            backgroundColor: theme.palette.warning.lighter,
            borderColor: theme.palette.warning.light
          }
        }
      }
    }
  };
}

function OutlinedInput(theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '10.5px 14px 10.5px 12px'
        },
        notchedOutline: {
          borderColor: theme.palette.grey[300]
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            '& .MuiOutlinedInput-notchedOutline': {
              border: `1px solid ${theme.palette.primary.light}`
            }
          },
          '&.Mui-error': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.error.light
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
              '& .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.error.light}`
              }
            }
          }
        },
        inputSizeSmall: {
          padding: '7.5px 8px 7.5px 12px'
        },
        inputMultiline: {
          padding: 0
        }
      }
    }
  };
}
function InputLabel(theme) {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[600]
        },
        outlined: {
          lineHeight: '0.8em',
          '&.MuiInputLabel-sizeSmall': {
            lineHeight: '1em'
          },
          '&.MuiInputLabel-shrink': {
            background: theme.palette.background.paper,
            padding: '0 8px',
            marginLeft: -6,
            lineHeight: '1.4375em'
          }
        }
      }
    }
  };
}
export default function CustomComponentSx(theme) {
  return merge(Button(theme), InputLabel(theme), IconButton(theme), OutlinedInput(theme), Typography(), Checkbox(theme), Chip(theme));
}
