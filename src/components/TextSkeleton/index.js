import React from 'react';
import './index.css'
import { Skeleton } from '@material-ui/lab';

const TextSkeleton = () => {
    return (
        <div className='text_skeleton_div'>
            <Skeleton 
                animation="wave" 
                className="text_skeleton" 
                variant="text"/>
        </div>
    );
};

export default TextSkeleton;
