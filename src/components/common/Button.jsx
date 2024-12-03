import { Button } from '@mui/material'
import React from 'react';



export function ThemeButton({ sx, color, children,size,...rest }) {
    styles.common = {
        ...styles.common,
        padding: size === 'small' ? '5px 10px' : '10px 20px',
        fontSize: size === 'small' ? '0.8rem' : '1rem',
        fontWeight: size === 'small' ? '400' : 'bold',
    }
    return (
        <Button variant="contained" color={color} {...rest} sx={{
            ...styles.common,
            ...styles.contained[color],
            ...sx,
            borderRadius: '30px 30px 30px 30px',
        }}>
            {children}
        </Button>
    )
}

export function OutlinedButton({ sx, color, children,size, ...rest }) {
    styles.common = {
        ...styles.common,
        padding: size === 'small' ? '5px 10px' : '10px 15px',
        fontSize: size === 'small' ? '0.8rem' : '1rem',
        fontWeight: size === 'small' ? '400' : 'bold',
    }
    return (
        <Button variant="outlined" color={color} {...rest} sx={{
            ...styles.common,
            ...styles.outlined[color],
            ...sx,
            borderRadius: '30px 30px 30px 30px',
        }}>
            {children}
        </Button>
    )
}





const styles = {
    common: {
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
        boxShadow: 'none',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        gap : '5px'
    },
    contained: {
        primary: {
            backgroundColor: 'primary.main',
            color: 'white.main',
        },
        secondary: {
            backgroundColor: 'secondary.main',
            color: 'white.main',
        }
    },
    outlined: {
        primary: {
            color: 'primary.main',
            border: '1px solid primary.main',
            backgroundColor : 'primary.light'
        },
        secondary: {
            color: 'secondary.main',
            border: '1px solid secondary.main',
        }
    }
}