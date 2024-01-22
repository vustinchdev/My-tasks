import { ThunkDispatchType } from "app/store"
import { useDispatch } from "react-redux"

export const useAppDispatch = useDispatch<ThunkDispatchType>
