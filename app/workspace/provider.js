"use client";

import React from 'react'

function WorkspaceProvider({ children }) {
    return (
        <div className='max-w-7xl mx-auto p-6'>
            {children}
        </div>
    )
}

export default WorkspaceProvider