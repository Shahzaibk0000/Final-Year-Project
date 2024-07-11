import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LocationCityOutlined as ManageAreaIcon,
  ManageAccountsOutlined as ManageAccountIcon,
  AccountCircleOutlined as ViewProfileIcon,
  BorderColorOutlined as EditProfileIcon,
  LogoutOutlined as LogoutIcon,
  LocalHospital as ManageHospitalIcon,
} from "@mui/icons-material";
import EditProfileDialog from "./EditProfileDialog";
import CustomCard from "@components/CustomCard";
import Transitions from "@components/animation/Transitions";
import ViewProfileDialog from "./ViewProfileDialog";
import { useUser } from "@context/UserContext";

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleviewProfile = () => {
    setViewProfileOpen(true);
    setOpen(false);
  };

  const handleEditProfileToggle = () => {
    setOpen(false);
    setEditProfileOpen((prevEditProfileOpen) => !prevEditProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    updateUser({
      id: null,
      firstName: "",
      lastName: "",
      usertype: "",
      contact: "",
      cnic: "",
      email: "",
      password: "",
      profilePicture: null,
      province: null,
      division: null,
      district: null,
      tehsil: null,
      hospital: null,
      createdOn: null,
    });

    setOpen(false);
    navigate("/login");
  };

  const anchorRef = useRef(null);

  return (
    <Box sx={{ flexShrink: 0, ml: "auto" }}>
      <Tooltip disableFocusListener disableTouchListener title="Open Setting">
        <ButtonBase
          sx={{
            p: 0.25,
            bgcolor: open ? "grey.300" : "transparent",
            borderRadius: 1,
            "&:hover": { bgcolor: "secondary.lighter" },
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? "profile-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ p: 0.5 }}
          >
            <Avatar
              alt="profile user"
              src={`data:image/jpeg;base64,${user.profilePicture}`}
              sx={{ width: 35, height: 35 }}
            />
            <Typography variant="subtitle1">{`${user.firstName} ${user.lastName}`}</Typography>
          </Stack>
        </ButtonBase>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down("md")]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <CustomCard elevation={0} border={false} content={false}>
                    <CardContent
                      sx={{
                        px: 2.5,
                        pt: 3,
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Stack
                            direction="row"
                            spacing={1.25}
                            alignItems="center"
                          >
                            <Avatar
                              alt="profile user"
                              src={`data:image/jpeg;base64,${user.profilePicture}`}
                              sx={{ width: 50, height: 50 }}
                            />
                            <Stack>
                              <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {user.usertype}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider sx={{ my: 0.5 }} />
                    <List
                      component="nav"
                      sx={{
                        p: 0,
                        "& .MuiListItemIcon-root": {
                          minWidth: 32,
                          color: theme.palette.grey[500],
                        },
                      }}
                    >
                      <ListItemButton onClick={handleviewProfile}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <ViewProfileIcon color="gray" />
                        </ListItemIcon>
                        <ListItemText primary="View Profile" />
                      </ListItemButton>
                      <Divider sx={{ my: 0.5 }} />
                      {user.usertype === "Super Administrator" && (
                        <>
                          <ListItemButton
                            component={Link}
                            to="/manage-account"
                            onClick={() => setOpen(false)}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <ManageAccountIcon color="gray" />
                            </ListItemIcon>
                            <ListItemText primary="Manage Account" />
                          </ListItemButton>
                          <Divider sx={{ my: 0.5 }} />
                          <ListItemButton
                            component={Link}
                            to="/manage-hospital"
                            onClick={() => setOpen(false)}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <ManageHospitalIcon color="gray" />
                            </ListItemIcon>
                            <ListItemText primary="Manage Hospital" />
                          </ListItemButton>
                          <Divider sx={{ my: 0.5 }} />
                          <ListItemButton
                            component={Link}
                            to="/manage-area"
                            onClick={() => setOpen(false)}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <ManageAreaIcon color="gray" />
                            </ListItemIcon>
                            <ListItemText primary="Manage Area" />
                          </ListItemButton>
                          <Divider sx={{ my: 0.5 }} />
                        </>
                      )}
                      <ListItemButton onClick={handleEditProfileToggle}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <EditProfileIcon color="gray" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Profile" />
                      </ListItemButton>
                      <Divider sx={{ my: 1 }} />
                      <ListItemButton onClick={handleLogout}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <LogoutIcon color="gray" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </List>
                  </CustomCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
      <ViewProfileDialog
        open={viewProfileOpen}
        onClose={() => setViewProfileOpen(false)}
      />
      <EditProfileDialog
        open={editProfileOpen}
        onClose={handleEditProfileToggle}
      />
    </Box>
  );
};

export default Profile;
