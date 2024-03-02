import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import LinearProgress from "@mui/material/LinearProgress"
import { selectStatus } from "app/appSelectors"
import { selectIsLoggedIn } from "features/auth/model/authSelectors"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { authThunks } from "features/auth/model/authSlice"
import s from './ButtonAppBar.module.css'

export function ButtonAppBar() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const handleLogoutButtonClick = () => {
    dispatch(authThunks.logout())
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={s.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolists
          </Typography>
          {isLoggedIn && (
            <Button onClick={handleLogoutButtonClick} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress color="info" />}
      </AppBar>
    </Box>
  )
}
