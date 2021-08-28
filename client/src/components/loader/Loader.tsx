import { Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Spin } from 'antd';
import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LoadingState } from '../../types';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Loader: FC = (): ReactElement => {
    const classes = useStyles();

    const isLoading = useSelector<RootState, LoadingState>((state: RootState) => state.loading);

    return (
        <Backdrop className={classes.backdrop} open={isLoading}>
            <Spin size="large" />
        </Backdrop>
    );
};

export default Loader;
