import PropTypes from "prop-types";
import {
  Typography,
  Divider,
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  useTheme,
} from "@mui/material";

const DrawerAutoComplete = ({
  options = [],
  value = [],
  onChange,
  title,
  disabled,
}) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Autocomplete
        disabled={disabled}
        multiple
        options={options.filter((v) => !value.some((val) => val.id === v.id))}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={onChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              label={option.name}
              size="small"
              {...getTagProps({ index })}
              sx={{
                backgroundColor: theme.palette.primary.light,
                marginRight: "4px",
                "& .MuiChip-deleteIcon": {
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />
          ))
        }
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              style={{
                marginRight: "4px",
                transform: "scale(1)",
                color: theme.palette.secondary[300],
              }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`Select ${title}`}
            sx={{ width: "235px" }}
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {
            p: 1,
          },
          "& .MuiAutocomplete-tag": {
            backgroundColor: theme.palette.primary.lighter,
            border: "1px solid",
            borderColor: theme.palette.primary.light,
            "& .MuiSvgIcon-root": {
              color: theme.palette.primary.main,
              "&:hover": {
                color: theme.palette.primary.dark,
              },
            },
          },
          mb: 2,
        }}
      />
      <Divider />
    </>
  );
};

DrawerAutoComplete.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default DrawerAutoComplete;
