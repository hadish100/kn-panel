import React from 'react'
import styles from './AmneziaFilter.module.css'
import Amnezia from '../assets/amn.png'

const AmneziaFilter = ({ enabled,setEnabled }) => {


    // if enabled amnezia-filter and amnezia-filter-active else amnezia-filter

    return (
        <div class={styles["amnezia-filter-container"]}>
            <img class={ enabled ?  styles["amnezia-filter-active"] : styles["amnezia-filter"]} src={Amnezia} alt="Amnezia Filter" onClick={() => setEnabled(!enabled)} />
        </div>
    )
}

export default AmneziaFilter