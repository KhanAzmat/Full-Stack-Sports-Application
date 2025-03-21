
import React from 'react';
import withStyles from '@mui/styles/withStyles';
import Switch from '@mui/material/Switch';


const pxToRem = (px, oneRemPx = 17) => `${px / oneRemPx}rem`;


  const borderWidth = 2;
  const width = pxToRem(70);
  const height = pxToRem(40);
  const size = pxToRem(32);
  const gap = (40 - 32) / 2;
  const primaryColor = '#60A29B';

  const SelectionSwitch = withStyles((theme) => ({
    root: {
      width,
      height,
      padding: 0,
      margin: theme.spacing(1),
      overflow: 'unset',
    },
    switchBase: {
      padding: pxToRem(gap),
      '&$checked': {
        color: theme.palette.common.white,
        transform: `translateX(calc(${width} - ${size} - ${pxToRem(2 * gap)}))`,
        '& + $track': {
          background: `linear-gradient(60deg,${theme.palette.primary.light},${theme.palette.secondary.main})`,
          opacity: 1,
        },
        '& $thumb': {
          //backgroundColor: '#fff',
          backgroundImage: `url("data:image/svg+xml,%3Csvg version='1.0' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 60.000000 60.000000' preserveAspectRatio='xMidYMid meet'%3E%3Cg transform='translate(0.000000,60.000000) scale(0.100000,-0.100000)'%0Afill='%23000000' stroke='none'%3E%3Cpath d='M168 537 c-65 -34 -118 -64 -118 -67 0 -3 57 -34 127 -69 l126 -64%0A123 64 c68 35 124 67 124 70 0 9 -235 129 -251 129 -8 0 -67 -28 -131 -63z'/%3E%3Cpath d='M32 288 l3 -163 120 -62 c66 -34 123 -62 128 -63 4 0 7 72 7 159 l0%0A159 -125 66 c-69 36 -128 66 -130 66 -3 0 -4 -73 -3 -162z'/%3E%3Cpath d='M428 379 l-118 -59 0 -160 c0 -88 3 -160 8 -160 4 1 61 29 127 63%0Al120 62 3 158 c2 122 0 157 -10 156 -7 0 -66 -27 -130 -60z'/%3E%3C/g%3E%3C/svg%3E")`,

        },
      },
    },
    track: {
      borderRadius: 40,
      background: `linear-gradient(60deg,${theme.palette.primary.light},${theme.palette.secondary.main})`,
      border: `1px solid ${theme.palette.grey[400]}`,
     // borderWidth,
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    thumb: {
      width: size,
      height: size,
      boxShadow: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Crect width='60' height='60' style='fill:%23000000;stroke-width:1;stroke:%23ffffff' /%3E%3C/svg%3E")`,

    },
    checked: {},
  
}))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  export { SelectionSwitch}

