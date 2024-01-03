import React from 'react'
import { AppRootStateType } from '../../app/store'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { v1 } from 'uuid';
import { tasksReducer } from '../../features/TodolistsList/tasks-reducer';
import { todolistsReducer } from '../../features/TodolistsList/todolists-reducer';
import { TaskPriorities, TaskStatuses } from '../../api/todolist-api';
import { appReducer } from '../../app/app-reducer';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState = {
    todolists: [
        {
            id: "todolistId1",
            title: "What to learn",
            filter: "all",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: "todolistId2",
            title: "What to buy",
            filter: "all",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        }
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                addedDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                todoListId: 'todolistId1'
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.New,
                description: '',
                addedDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                todoListId: 'todolistId1'
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.New,
                description: '',
                addedDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                todoListId: 'todolistId2'
            },
            {
                id: v1(),
                title: "React Book",
                status: TaskStatuses.Completed,
                description: '',
                addedDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                todoListId: 'todolistId2'
            }
        ]
    },
    app: {
        status: 'idle',
        error: null
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
