import CircularProgress from "@mui/material/CircularProgress"
import s from "./LoadingIndicator.module.css"

export const LoadingIndicator = () => {
  return (
    <div className={s.circularProgressContainer}>
      <CircularProgress />
    </div>
  )
}
