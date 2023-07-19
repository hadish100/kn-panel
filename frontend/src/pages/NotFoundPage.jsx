import React from 'react'

import { ReactComponent as PageNotFoundSVG } from '../assets/svg/page-not-found.svg'

const NotFoundPage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 2rem"
            }}
        >
            <PageNotFoundSVG />
        </div >
    )
}

export default NotFoundPage