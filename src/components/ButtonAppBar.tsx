import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import LinearProgress from "@mui/material/LinearProgress"
import { useAppDispatch, useAppSelector } from "app/store"
import { logoutTC } from "features/Login/authSlice"
import { selectStatus } from "app/app.selectors"
import { selectIsLoggedIn } from "features/Login/auth.selectors"

export default function ButtonAppBar() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const handleLogoutButtonClick = () => {
    dispatch(logoutTC())
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolists
          </Typography>
          {isLoggedIn && (
            <Button onClick={handleLogoutButtonClick} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress color="secondary" />}
      </AppBar>
    </Box>
  )
}
