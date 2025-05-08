import React from 'react'
import VideoList from './_components/VideoList'

function Workspace() {
    return (
        <div className='mt-7'>
            <h2 className='font-bold text-2xl'>Explore and Create New Video Ads</h2>
            <p>Start exploring new video ads and create on for you</p>
            <VideoList />
        </div>
    )
}

export default Workspace