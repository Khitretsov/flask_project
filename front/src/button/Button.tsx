import React from 'react';
import './style.css';

type TButton = {
    isLoading?: boolean,
    isDisabled?: boolean,
    onClick?: () => void,
    style?: any
}

const Buton: React.FunctionComponent<TButton> = ({
    isLoading = false,
    isDisabled = false,
    onClick,
    children,
    style = {}
}) => {

    return <div>    
        <div style={style} className='main_block'>
        {
            isLoading ?
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            :
                <input {...{
                    onClick: () => { onClick && onClick() },
                    className: "button",
                    type: 'submit',
                    value: children && typeof children === 'string' ?  children : 'Submit',
                    disabled: isDisabled,
                }}/>
        }
        </div>
    </div>
}

export default Buton
