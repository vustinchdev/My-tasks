import React, { useEffect, useState } from "react"
import { UpdateTaskModelType, todolistAPI } from "../TodolistsList/todolist-api"

export default {
  title: "API",
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistAPI.getTodolists().then((res) => setState(res.data))
  }, [])
  return <div>{JSON.stringify(state)}</div>
}
export const AddTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistAPI.addTodolist("React").then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "50a4004f-1299-4b72-8fdf-149ba53504e8"
    todolistAPI.deleteTodolist(todolistId).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const id = "3672c963-e08b-4568-88c3-59f47d1d6992"
    todolistAPI.updateTodolist({ id, title: "Redux" }).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "fa367149-7782-46a5-98a6-f274643632b7"
    todolistAPI.getTasks(todolistId).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const AddTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "fa367149-7782-46a5-98a6-f274643632b7"
    todolistAPI.addTask({ todolistId, title: "React" }).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "fa367149-7782-46a5-98a6-f274643632b7"
    const taskId = "483738d5-afac-44ba-8a6a-d9bb9e52723d"
    todolistAPI.deleteTask({ todolistId, taskId }).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "fa367149-7782-46a5-98a6-f274643632b7"
    const taskId = "936dacf3-4627-4ac2-aee6-90d620e4d15c"
    const model: UpdateTaskModelType = {
      title: "Redux",
      description: "",
      status: 0,
      priority: 0,
      startDate: "",
      deadline: "",
    }
    todolistAPI.updateTask(todolistId, taskId, model).then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
