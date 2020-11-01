import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Register } from './register'
import { Blog } from './blog'
import { Button } from './button'

import { urlRoot } from './settings'


function App() {
  if (!localStorage.isUserLogin) {
    localStorage.setItem('isUserLogin', 'false')
    localStorage.setItem('username', '')
  }

  let [isRegisterPage, setIsRegisterPage] = React.useState(localStorage.isUserLogin === 'false')

  let [isLoading, setIsLoading] = React.useState(false)

  const logout = async () => {
    setIsLoading(true)
    let response;
    response = await fetch(
      `${ urlRoot }/auth/logout`
    )
    setIsRegisterPage(!isRegisterPage)
    localStorage.isUserLogin = 'false'
    localStorage.setItem('username', '')
    setIsLoading(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p> Your name: { localStorage.username } </p>
        {
          isRegisterPage || 
            <Button {...{
                isLoading,
                onClick: logout,
                style: {marginBottom: '10px'}
            }}>
              Log out
            </Button>
        }
      </header>
      <div className='App-content'>
        {
          isRegisterPage ? 
            <Register {...{
              changeView: () => {
                setIsRegisterPage(!isRegisterPage)
              }            
            }}/>
          :
            <Blog />
        }
      </div>
    </div>
  );
}

export default App;
