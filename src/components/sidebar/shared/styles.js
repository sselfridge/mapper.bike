import { makeStyles } from "@material-ui/core/";

export const useRowStyles = makeStyles((theme) => ({
  actions: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  itemNumber: {
    minWidth: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  listItem: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, .12)",
    },
  },
  secondaryText: {
    display: "flex",
    justifyContent: "space-between",
  },
  selectedStyle: {
    backgroundColor: "rgba(0, 0, 0, .13)",
  },
  stravaIcon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.strava,
  },
  stravaBtn: {
    backgroundColor: theme.palette.strava,
    color: "white",
    maxHeight: 40,
  },
}));
