import React from "react"
import Grid from "@mui/material/Grid"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useFormik } from "formik"
import { loginTC } from "./authSlice"
import { Navigate } from "react-router-dom"
import { LoginParams } from "features/auth/auth-api"
import { selectIsLoggedIn } from "./auth.selectors"
import { useAppDispatch, useAppSelector } from "common/hooks"

const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const { getFieldProps, resetForm, handleSubmit, touched, errors } = useFormik<LoginParams>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values) => {
      dispatch(loginTC(values))
      resetForm()
    },
    validate: (values: LoginParams) => {
      const errors: Partial<Omit<LoginParams, "rememberMe">> = {}
      if (!values.email) {
        errors.email = "Required"
      } else if (!EMAIL_REGEXP.test(values.email)) {
        errors.email = "Invalid email address"
      }
      if (!values.password) {
        errors.password = "Required"
      } else if (values.password.length < 3) {
        errors.password = "Password should be 3 or more characters longs"
      }
      return errors
    },
  })

  if (isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
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
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
