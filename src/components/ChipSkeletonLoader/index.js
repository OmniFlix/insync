import React from 'react';
import './index.css'
import { Skeleton } from '@material-ui/lab';

const ChipSkeleton = () => {
    return (
        <Skeleton 
            animation="wave" 
            className="chip_skeleton" 
            variant="text"/>
    );
};

export default ChipSkeleton;
