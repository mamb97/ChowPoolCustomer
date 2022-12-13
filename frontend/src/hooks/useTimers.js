import React from 'react'
import { useState, useEffect } from 'react';
import moment from 'moment'

export const Timers = ({startDate, mins, secs, message}) => {

    const [min, updateMin] = useState(0)
    const [sec, updateSec] = useState(0)
    useEffect(() => {        
        const nowTime = Date.parse(Date())
        const deadLineTime = startDate + ((mins * 60 + secs) * 1000)
        if (Date.parse(Date()) < deadLineTime){
            const diffDuration = moment.duration(deadLineTime-Date.parse(Date()));
            console.log(diffDuration, nowTime)
            updateMin(diffDuration.minutes())
            updateSec(diffDuration.seconds())
        }
        else{
            updateMin(0)
            updateSec(0)
        }
    }, [min, sec, 1000])

    return (
        <div>
        
        { min === 0 && sec === 0
            ? null
            : <div><p>{message}</p><h1> {min}:{sec < 10 ?  `0${sec}` : sec}</h1></div>
        }
        </div>
    )


}