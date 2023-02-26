import React from 'react'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { CardProps } from '../../interfaces';
import { orange } from '@mui/material/colors';

export const CardComponent = (props: CardProps) => {
  const {
    step,
    name,
    label,
    heading,
    children,
    description,
    displayChild,
    button_1_name,
    textFieldType, 
    button_2_name,
    button_3_name,
    button_1_start,
    button_2_start,
    button_3_start,
    displayTextfield,
    isButton_1_display,
    isButton_2_display,
    isButton_3_display,
    handleButton_1_Click,
    handleButton_2_Click,
    handleButton_3_Click,
    handleTextfieldChange,
 } = props;

  return (
    <Card sx={{ 
        height: '100%',
        width: 'fit-content',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-around', 
        alignItems: 'center',
        background: 'none',
        border: '0.1em solid rgba(100, 100, 100, 0.5)',
        '&:hover': {
          background: 'rgba(100, 100, 100, 0.3)',
          color: 'whitesmoke',
          transition: '0.2sec ease-in-out'
        }
      }}>
        <Typography gutterBottom variant="button" component="h4" sx={{color: 'rgba(100, 100, 100, 0.7)', mt: 2}}>
          {step}
        </Typography>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="button" component="h2" sx={{color: orange[500]}}>
          {heading}
        </Typography>
        <Typography gutterBottom variant='body1' sx={{color: 'green'}}>
          {description}
        </Typography>
        {displayTextfield && <TextField margin="normal" required fullWidth id="number" label={label} name={name} autoComplete="amount" type={textFieldType} autoFocus onChange={(e) => handleTextfieldChange? handleTextfieldChange(e) : null} /> }
      </CardContent>
      <CardActions>
        { isButton_1_display && <Button startIcon={button_1_start} variant={'contained'} sx={{
          background: 'rgba(100, 100, 100, 0.6)',
          width: '100%',
          p: 2,
          // color: 'whitesmoke',
          '&:hover': {
            background: 'none',
            color: 'white',
            border: '0.1px solid rgba(100, 100, 100, 0.6)',
            transition: '0.2sec ease-in-out'
          }
        }} onClick={handleButton_1_Click} size="small">{displayChild? children : button_1_name}</Button>}
        { isButton_2_display && <Button startIcon={button_2_start} variant={'contained'} sx={{
          background: 'rgba(100, 100, 100, 0.6)',
          width: '100%',
          p: 2,
          '&:hover': {
            background: 'none',
            color: 'white',
            border: '0.1px solid rgba(100, 100, 100, 0.5)',
            transition: '0.2sec ease-in-out'
          }
        }} onClick={handleButton_2_Click} size="small">{displayChild? children : button_2_name}</Button>}
        { isButton_3_display && <Button startIcon={button_3_start} variant={'contained'} sx={{
          background: 'rgba(100, 100, 100, 0.6)',
          width: '100%',
          p: 2,
          '&:hover': {
            background: 'none',
            color: 'white',
            border: '0.1px solid rgba(100, 100, 100, 0.5)',
            transition: '0.2sec ease-in-out'
          }
        }} onClick={handleButton_3_Click} size="small">{displayChild? children : button_3_name}</Button>}
      </CardActions>
    </Card>
  )
}
