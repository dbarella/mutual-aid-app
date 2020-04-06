import React, { useState } from "react";
import useAxios from "axios-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  successMessage: {
    color: theme.palette.success.dark
  }
}));

const SaveNeighborhoodData = ({ neighborhoodData, className }) => {
  const classes = useStyles();
  const [requestCode, setRequestCode] = useState("");
  const [{ data, loading, error }, submit] = useAxios(
    {
      url: `/api/authed/intake/neighborhood-finder`,
      method: "post"
    },
    { manual: true } // Don't send on render
  );

  const handleAddToAirtable = event => {
    event.preventDefault();
    submit({
      data: {
        requestCode: requestCode.toUpperCase(),
        neighborhoodData
      }
    });
  };

  return (
    <>
      <form onSubmit={handleAddToAirtable} autoComplete="off">
        <TextField
          id="request_code"
          name="request_code"
          label="Request code, e.g. V8DL"
          type="text"
          margin="normal"
          variant="outlined"
          onKeyUp={e => (e.target.value = (e.target.value || "").toUpperCase())}
          onChange={e => setRequestCode(e.target.value)}
          className={`${className}`}
          error={Boolean(error)}
          helperText={error && error.response.data.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  aria-label="request_code"
                  onClick={handleAddToAirtable}
                >
                  Add info to Airtable
                </Button>
              </InputAdornment>
            )
          }}
        />
      </form>
      {loading && <CircularProgress />}
      {!error && data && data.success && (
        <Typography variant="caption" className={classes.successMessage}
        >
          Successfully updated request
        </Typography>
      )}
    </>
  );
};

export default SaveNeighborhoodData;
