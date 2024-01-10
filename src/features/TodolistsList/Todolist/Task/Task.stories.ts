import type { Meta, StoryObj } from "@storybook/react"
import { Task } from "./Task"
import { TaskStatuses, TaskPriorities } from "api/todolist-api"
import { ReduxStoreProviderDecorator } from "stories/decorators/ReduxStoreProviderDecorator"

const meta = {
  title: "Todolists/Task",
  component: Task,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    task: {
      id: "taskId1",
      title: "JS",
      status: TaskStatuses.Completed,
      description: "",
      addedDate: "",
      deadline: "",
      order: 0,
      priority: TaskPriorities.Low,
      startDate: "",
      todoListId: "todolistId1",
      entityTaskStatus: "idle",
    },
    todolistId: "todolistId1",
  },
  decorators: [ReduxStoreProviderDecorator],
} satisfies Meta<typeof Task>

export default meta
type Story = StoryObj<typeof meta>

export const TaskIsDoneStory: Story = {}
export const TaskIsActiveStory: Story = {
  args: {
    task: {
      id: "taskId1",
      title: "JS",
      status: TaskStatuses.New,
      description: "",
      addedDate: "",
      deadline: "",
      order: 0,
      priority: TaskPriorities.Low,
      startDate: "",
      todoListId: "todolistId1",
      entityTaskStatus: "idle",
    },
  },
}
