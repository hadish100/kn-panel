import React from 'react'

import styles from './TimerBar.module.css'

const TimerBar = ({ duration }) => {
    return (
        <div>
            <div className={styles['timer-bar']}>
                <div className={styles['timer-bar__filler']} style={{ width: '0%', '--duration': duration }}></div>
            </div>
        </div>
    )
}

export default TimerBar