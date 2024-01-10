import type { Meta, StoryObj } from "@storybook/react"
import App from "./App"
import { ReduxStoreProviderDecorator } from "stories/decorators/ReduxStoreProviderDecorator"

const meta = {
  title: "Todolists/App",
  component: App,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [ReduxStoreProviderDecorator],
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const AppStory: Story = {
  args: {
    demo: true,
  },
}
