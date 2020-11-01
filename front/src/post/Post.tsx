import React from 'react'
import './style.css'

import { Button } from '../button'
import { TPost } from '../types'

import { urlRoot } from '../settings'


const Post: React.FunctionComponent<TPost> = ({ body, title, id, created, username }) => {
    let [text, setText] = React.useState(body)
    let [header, setHeader] = React.useState(title)
    let [textCopy, setTextCopy] = React.useState(body)
    let [headerCopy, setHeaderCopy] = React.useState(title)

    let [isReadMode, setMode] = React.useState(true)
    let [isPostDeleted, deletePost] = React.useState(false)
    let [isLoading, setIsLoading] = React.useState(false)
    let [error, setError] = React.useState('')

    let profileName = localStorage.username
    const isPostEditable = profileName === username

    if (isPostDeleted) return <div key={ id }></div>   //  Не вижу смысла перебирать массив заметок на уровне родительского компанента

    const postDeleting = async () => {
        setIsLoading(true)
        let response;
        response = await fetch(
            `${ urlRoot }/blog/${ id }/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            // body: JSON.stringify({header, body: text})
        })

        let json = await response.json()

        if (json.is_success) {
            deletePost(true)
        } else {
            setError(json.message)
        }

        setIsLoading(false)
    }

    const postUpdating = async () => {
        setIsLoading(true)
        let response = await fetch(
            `${ urlRoot }/blog/${ id }/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({title: header, body: text})
        })

        let json = await response.json()
        if (json.is_success) {
            setText(textCopy)
            setHeader(headerCopy)
            setMode(!isReadMode)
        } else {
            setError(json.message)
        }

        setIsLoading(false)

    }

    return <div key={ id } className='post'>
        <div>
            <div {...{
                className: 'title_area',
            }}>
                <span> Autor: { username } </span>
                <span> Date: { created } </span>
            </div>
           
            <div className='post_header'>
                <div>
                    <input {...{
                        type: 'text',
                        value: headerCopy,
                        readOnly: isReadMode,
                        disabled: isLoading,
                        onChange: (e) => { setHeaderCopy(e.target.value) }
                    }}/>
                </div>

                {
                    isPostEditable && (
                        isReadMode ?
                        <span className='buttons_block'>
                            <Button {...{
                                isLoading: false,
                                onClick: () => { setMode(!isReadMode) }
                            }}> Edit </Button>
                            {
                                error.length === 0 ?
                                    <Button {...{
                                        isLoading,
                                        onClick: () => {
                                            postDeleting()
                                        }
                                    }}> Delete </Button>
                                :
                                    <Button {...{
                                        isLoading: false,
                                        onClick: () => {
                                            setError('')
                                        }
                                    }}>
                                        Hide error
                                    </Button>
                            }
                        </span>
                        :
                        <span className='buttons_block'>
                            <Button {...{
                                onClick: postUpdating,
                                isLoading,
                            }}> Save </Button>
                            <Button {...{
                                isLoading: false,
                                onClick: () => {
                                    setError('')
                                    setHeaderCopy(header)
                                    setTextCopy(text)
                                    setMode(!isReadMode)
                                }
                            }}> Cancel </Button>
                        </span>
                    )
                }
            </div>
            <div style={{ color: 'red' }}> 
                { error }   
            </div>


        </div>
        <div>
            <textarea {...{
                rows: 5,
                cols: 70,
                readOnly: isReadMode,
                value: textCopy,
                disabled: isLoading,
                onChange: (e) => { setTextCopy(e.target.value) } 
            }} />
        </div>
    </div>
}

export default Post