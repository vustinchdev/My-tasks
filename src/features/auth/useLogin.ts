import { useAppDispatch, useAppSelector } from "common/hooks"
import { BaseResponse } from "common/types"
import { useFormik } from "formik"
import { LoginParams } from "./auth-api"
import { selectIsLoggedIn } from "./auth.selectors"
import { authThunks } from "./authSlice"

type FormikError = Partial<Omit<LoginParams, "captcha">>

export const useLogin = () => {
  const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const { getFieldProps, handleSubmit, touched, errors } = useFormik<LoginParams>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((res: BaseResponse) => {
          res.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
    },
    validate: (values: LoginParams) => {
      const errors: FormikError = {}
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

  return { isLoggedIn, handleSubmit, getFieldProps, touched, errors }
}
