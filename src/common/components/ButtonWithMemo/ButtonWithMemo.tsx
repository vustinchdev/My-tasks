import React, { memo } from "react"
import { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"

interface ButtonWithMemo extends ButtonProps {}

export const ButtonWithMemo: React.FC<ButtonWithMemo> = memo((props) => {
  return (
    <Button variant={props.variant} color={props.color} onClick={props.onClick}>
      {props.title}
    </Button>
  )
})
