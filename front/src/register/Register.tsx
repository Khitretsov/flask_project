import React from 'react';
import './style.css';

import { urlRoot } from '../settings'

import { Button } from '../button'

type TRegister = {
    changeView: () => void
}
export default function Register({changeView}: TRegister) {

    let [username, setUsername] = React.useState('')
    let [password, setPassword] = React.useState('')
    let [isUserExist, setIsUserExist] = React.useState(true)
    let [error, setError] = React.useState('')

    let [isLoading, setIsLoading] = React.useState(false)

    const authorization = async () => {
        setIsLoading(true)
        let response;
        response = await fetch(
            `${ urlRoot }/auth/${isUserExist ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username, password})
        })

        let json = await response.json()

        if (json.is_success) {
            setPassword('')
            setUsername('')
            setIsUserExist(json.is_success)
            error.length > 0 && setError('')
            if ( isUserExist ) {
                localStorage.username = username
                localStorage.isUserLogin = 'true'
                changeView()
            } 
        } else {
            setError(json.message)
            setIsLoading(false)
        }
    }
    
    const changeMode = (registerMode: boolean) => {
        setIsUserExist(registerMode)
        setPassword('')
        setUsername('')
        error.length > 0 && setError('')
}

    return <div>
        {
            isUserExist ? 
                <h2>Log in</h2>
            :
                <h2>Register a new user</h2>
        }

        <form className="form" onSubmit={
            (e) => { 
                e.preventDefault()
                authorization()
            }
        }>
            <div className="item">
                <label>
                    Username:
                </label>
                <input {...{
                    type: 'text',
                    value: username,
                    onChange: (e) => {
                        setUsername(e.target.value)
                    },
                    disabled: isLoading,
                }}/>
            </div>
            <div className="item">
                <label>
                    Password:
                </label>
                <input {...{
                    type: 'password',
                    value: password,
                    onChange: (e) => {
                        setPassword(e.target.value)
                    },
                    disabled: isLoading,
                }}/>
            </div>
            <Button {...{
                isLoading,
                isDisabled: !(username.length > 0 && password.length > 0),
                style: {marginTop: '4vh'}
            }}/>
        </form>
        <div className="error-block">
            { error }
        </div>
        <div className="link-block">
            {
                isUserExist ?
                    <a href='#' onClick={() => { changeMode(false) }}>
                        Create account
                    </a>
                :
                    <a href='#' onClick={() => { changeMode(true) }}>
                        I already have account
                    </a>
            }
        </div>
    </div>
}