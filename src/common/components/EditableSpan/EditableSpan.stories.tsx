import type { Meta, StoryObj } from "@storybook/react"
import { EditableSpan } from "./EditableSpan"

const meta = {
  title: "Todolists/EditableSpan",
  component: EditableSpan,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: {
      description: "Clicked change span",
      action: "clicked",
    },
  },
  args: {
    titleValue: "JS",
  },
} satisfies Meta<typeof EditableSpan>

export default meta
type Story = StoryObj<typeof meta>

export const EditableSpanStory: Story = {}
