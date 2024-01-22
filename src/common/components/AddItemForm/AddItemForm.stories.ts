import type { Meta, StoryObj } from "@storybook/react"
import { AddItemForm } from "./AddItemForm"

const meta = {
  title: "Todolists/AddItemForm",
  component: AddItemForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: {
      description: "Button clicked inside form",
      action: "clicked",
    },
  },
} satisfies Meta<typeof AddItemForm>

export default meta
type Story = StoryObj<typeof meta>

export const AddItemFormStory: Story = {}
