import React from 'react'
import WorkspaceProvider from './provider'
import './workspace.css'

function WorkspaceLayout({ children }) {
    return (
        <div className="workspace-container">
            <WorkspaceProvider>
                {children}
            </WorkspaceProvider>
        </div>
    )
}

export default WorkspaceLayout