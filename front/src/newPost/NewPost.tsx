import React from 'react'
import './style.css';
import { urlRoot } from '../settings'

import { Button } from '../button'

type TNewPost = {
    addNewPost: (post: any) => void
}

const NewPost = ({ addNewPost }: TNewPost) => {

    let [isCreationMode, setMode] = React.useState(false)
    let [title, setTitle] = React.useState('')
    let [text, setText] = React.useState('')
    let [error, setError] = React.useState('')
    let [isLoading, setLoading] = React.useState(false)

    const postCreating = async () => {
        setLoading(true)
        let response;
        response = await fetch(
            `${ urlRoot }/blog/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({title, body: text})
        })

        let json = await response.json()

        if (json.is_success) {
            setTitle('')
            setText('')
            setMode(!isCreationMode)
            addNewPost(json.message[0])
        } else {
            setError(json.message)
        }
        setLoading(false)
    }

    return <div className='new_post'>
        {
            isCreationMode ?
                <div className='post_header_new_post'>
                    <div>
                        <span> Title: </span>
                        <input {...{
                            type: 'text',
                            disabled: isLoading,
                            value: title,
                            onChange: (e) => { setTitle(e.target.value) }
                        }}/>
                    </div>
                    <div className='buttons_block_new_post' >
                        <Button {...{
                            onClick: postCreating,
                            isLoading, 
                        }}>
                            Save
                        </Button>
                        <Button {...{
                            isLoading: false,
                            onClick: () => {
                                setTitle('')
                                setText('')
                                setError('')
                                setMode(!isCreationMode)
                            }
                        }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            :
            <button {...{
                onClick: () => {
                    setMode(!isCreationMode)
                }
            }}>
                    Create new post
                </button>
        }
        <div style={{ color: 'red' }}> { error } </div>
        {
            isCreationMode && <div>
                <textarea {...{
                    rows: 5,
                    cols: 70,
                    value: text,
                    disabled: isLoading,
                    onChange: (e) => { setText(e.target.value) } 
                }} />
            </div>
        }
    </div>
}

export default NewPost