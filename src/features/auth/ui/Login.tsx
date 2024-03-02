import Grid from "@mui/material/Grid"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Navigate } from "react-router-dom"
import { useLogin } from "../lib/useLogin"
import s from './Login.module.css'

export const Login = () => {
  const { isLoggedIn, errors, getFieldProps, handleSubmit, touched } = useLogin()

  if (isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={handleSubmit} className={s.formLogin}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noreferrer">
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...getFieldProps("email")} />
              {touched.email && errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              <TextField type="password" label="Password" margin="normal" {...getFieldProps("password")} />
              {touched.password && errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
              <FormControlLabel label={"Remember me"} control={<Checkbox {...getFieldProps("rememberMe")} />} />
              <Button type={"submit"} variant={"contained"} sx={{backgroundColor: "#722f37"}}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
