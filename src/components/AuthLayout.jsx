import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function Protected({ children, authentication = true }) {
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();

    const authStatus=useSelector((state)=>state.auth.status);

    useEffect(()=>{
        setLoading(true);
        if(authentication===true && authStatus===false){
            navigate("/login");
        }
        else if(authentication===false && authStatus===true){
            navigate('/');
        }
        //if both are true then also it should navigate to navigate('/');

        setLoading(false);
    },[authStatus,navigate,authentication])


    return loading ? <h1>Loading...</h1> : <>{children}</>
}

export default Protected