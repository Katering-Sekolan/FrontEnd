import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  customSnapContainer: {
    backgroundColor: "#ffffff",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

const SnapMidtransContainer = () => {
  const classes = useStyles();

  return (
    <div id="snap-container" className={classes.customSnapContainer}></div>
  );
};

export default SnapMidtransContainer;
