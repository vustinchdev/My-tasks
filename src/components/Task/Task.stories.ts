import type { Meta, StoryObj } from '@storybook/react';
import { Task } from './Task';
import { ReduxStoreProviderDecorator } from '../../state/ReduxStoreProviderDecorator';


const meta = {
    title: 'Todolists/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        task: { id: 'taskId1', title: 'JS', isDone: true },
        todolistId: 'todolistId1'
    },
    decorators: [ReduxStoreProviderDecorator]
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskIsDoneStory: Story = {};
export const TaskIsActiveStory: Story = {
    args: {
        task: { id: 'taskId1', title: 'JS', isDone: false }
    }
};
