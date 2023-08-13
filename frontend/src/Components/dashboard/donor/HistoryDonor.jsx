import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "./HistoryDonor.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../Hooks/useAuthContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import dayjs from "dayjs";

const HistoryDonor = () => {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const sidebarProp = {
    home: false,
    historyDonor: true,
    rewards: false,
    donor: true,
    active: {
      padding: "18px",
      border: "none",
      textAlign: "center",
      color: "#40339F",
      borderRadius: "8px",
      backgroundColor: "#fff",
      cursor: "pointer",
    },
  };

  const { user } = useAuthContext();

  const navigate = useNavigate();
  const url = "http://localhost:8000";
  // donor window
  const fetchDonorHistory = async (user_id) => {
    try {
      let { data } = await axios.post(
        `${url}/donation/donor-history/`,
        {
          donor_id: user_id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setData(data);
      setNewData(data);
      console.log("Data", data);
      if (!data || data.length === 0) {
        toast.warn("No history found at the moment!");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const compareDates = (a, b) => {
    const dateA = new Date(dayjs(a.required_on).format("YYYY-MM-DD "));
    const dateB = new Date(dayjs(b.required_on).format("YYYY-MM-DD "));

    if (order === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  };

  const compareOthers = (a, b) => {
    const unitA = a.units_required;
    const unitB = b.units_required;
    if (order === "asc") {
      return unitA > unitB ? 1 : -1;
    } else {
      return unitA < unitB ? 1 : -1;
    }
  };

  //filter handling
  const handleFilterClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResetClick = () => {
    setNewData(data);
    setFilterBloodGroup("");
    setFilterStatus("");
  };
  const handleFilterBloodChange = (event) => {
    setFilterBloodGroup(event.target.value);
  };
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  //total filter applied here
  const handleApplyFilter = () => {
    const filteredArr = data.filter((d) => {
      if (filterBloodGroup.length == 0 && filterStatus.length > 0)
        return d.current_status === filterStatus;
      else if (filterBloodGroup.length > 0 && filterStatus.length == 0)
        return d.blood_group === filterBloodGroup;
      else
        return (
          d.blood_group === filterBloodGroup &&
          d.current_status === filterStatus
        );
    });
    setNewData(filteredArr);
    handleClose();
  };

  //sort filter
  const handleSortChange = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    sortedData(order, orderBy);
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const sortedData = (order, orderBy) => {
    if (orderBy === "reqdate") {
      setNewData(newData.sort(compareDates));
    } else {
      setNewData(newData.sort(compareOthers));
    }
  };

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (user.donor_id !== null) {
      console.log("calling api");
      fetchDonorHistory(user.donor_id);
    } else {
      toast.error("Donor not found!");
      navigate("/");
    }
  }, [user]);

  return (
    <div className="historyContainer">
      <div className="historyLeft">
        <Sidebar {...sidebarProp} />
      </div>
      <div className="historyRight">
        <div className="headerBox">
          <Header />
        </div>
        <div className="historyTable">
          {/* tooltip for filter */}
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            }}
          >
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
              fontWeight="bold"
            >
              Donation Requests
            </Typography>

            <Tooltip title="Reset Filter">
              <IconButton onClick={handleResetClick}>
                <RotateLeftRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter list">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
              <DialogTitle>Filter Settings</DialogTitle>
              <DialogContent>
                {/* put options for filter */}
                <TextField
                  select
                  label="Blood Group"
                  value={filterBloodGroup}
                  onChange={handleFilterBloodChange}
                  fullWidth
                  variant="outlined"
                  sx={{ marginTop: "10px" }}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Status"
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  fullWidth
                  variant="outlined"
                  sx={{ marginTop: "10px" }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="fullfilled">Fulfilled</MenuItem>
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="error">
                  Close
                </Button>
                <Button onClick={handleApplyFilter} color="error">
                  Apply
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
          <TableContainer component={Paper} sx={{ borderRadius: "20px" }}>
            <Table
              sx={{ minWidth: 650 }}
              size="Large"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    Reciever
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    Blood Group
                  </TableCell>
                  <TableCell
                    align="left"
                    className="tableHead"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="left"
                    className="tableHead"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    <TableSortLabel
                      active={orderBy === "units"}
                      direction={order}
                      onClick={() => handleSortChange("units")}
                    >
                      Units
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="tableHead"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    <TableSortLabel
                      active={orderBy === "dondate"}
                      direction={order}
                      onClick={() => handleSortChange("dondate")}
                      disabled
                    >
                      Date of Donation
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="tableHead"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    <TableSortLabel
                      active={orderBy === "reqdate"}
                      direction={order}
                      onClick={() => handleSortChange("reqdate")}
                    >
                      Required On
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newData && newData.length !== 0 ? (
                  newData.map((data) => (
                    <TableRow
                      key={data.request_id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                      className="coloredBg"
                    >
                      <TableCell component="th" scope="row">
                        {data.current_status === "fullfilled" ||
                        data.current_status === "active"
                          ? data.requested_by.first_name +
                            " " +
                            data.requested_by.last_name
                          : "--"}
                      </TableCell>
                      <TableCell align="left">{data.blood_group}</TableCell>
                      <TableCell align="left">{toTitleCase(data.current_status)}</TableCell>
                      <TableCell align="left">{data.units_required}</TableCell>
                      <TableCell align="left">--</TableCell>
                      <TableCell align="left">
                        {dayjs(data.required_on).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                    className="coloredBg"
                  >
                    <TableCell component="th" scope="row">
                      --
                    </TableCell>
                    <TableCell align="left">--</TableCell>
                    <TableCell align="left">--</TableCell>
                    <TableCell align="left">--</TableCell>
                    <TableCell align="left">--</TableCell>
                    <TableCell align="left">--</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoryDonor;
