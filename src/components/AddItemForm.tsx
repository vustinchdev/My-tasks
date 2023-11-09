import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';

type AddItemFormPropsType = {
    onClick: (newTitle: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = (props) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addItem = () => {
        let newTitle = title.trim()
        if (newTitle !== '') {
            props.onClick(newTitle)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addItem()
        }
    }

    return (
        <div>
            <TextField
                error={!!error}
                id="outlined-basic"
                label={error ? error : 'type smth...'}
                variant="outlined"
                size='small'
                value={title}
                onChange={onNewTitleChangeHandler}
                onKeyDown={onKeyDownHandler}
            />
            <IconButton onClick={addItem}>
                <AddBoxIcon style={{ color: '#2e7d32', width: '30px' }} />
            </IconButton>
        </div>
    )
}
