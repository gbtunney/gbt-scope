import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import Slider, { SliderProps } from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { ReactElement, useState } from 'react'
import type { Merge } from 'type-fest'

export type InputSliderProps = Merge<
    SliderProps,
    {
        value?: number
        label?: string
        labelWidth?: string
        /** Add an onChange prop */
        onChange?: (value: number) => void
    }
>

export const InputSlider = ({
    label = undefined,
    labelWidth = 'calc(100%/5)',
    max = 100,
    min = 0,
    onChange,
    step = 10,
    value = 50, // Destructure the onChange prop
}: InputSliderProps): ReactElement => {
    const [_value, setValue] = useState<number>(value)

    const handleSliderChange = (event: Event, newValue: number): void => {
        setUpdatedValue(newValue)
    }
    const setUpdatedValue = (__value: number): void => {
        const newvalue: number =
            min !== undefined && __value < min
                ? min
                : max !== undefined && __value > max
                  ? max
                  : __value

        if (newvalue !== _value) {
            setValue(newvalue)
            console.log('NEW SLIDER VALUE!@@@', newvalue)
            if (onChange !== undefined) onChange(newvalue) // Emit the change event
        }
    }
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const newValue =
            event.target.value === '' ? 0 : Number(event.target.value)
        setUpdatedValue(newValue)
    }

    const handleBlur = (): void => {
        setUpdatedValue(_value)
    }

    return (
        <Box>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Typography
                    noWrap={true}
                    variant={'body2'}
                    id="input-slider"
                    style={{
                        ...(label === undefined ? { display: 'none' } : {}),
                        width: labelWidth,
                    }}>
                    {label}
                </Typography>
                <Grid size="grow">
                    <Slider
                        value={typeof _value === 'number' ? _value : 0}
                        min={min}
                        max={max}
                        step={step}
                        onChange={handleSliderChange}
                        valueLabelDisplay={'auto'}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid>
                    <Input
                        value={_value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            'aria-labelledby': 'input-slider',
                            max,
                            min,
                            step,
                            'type': 'number',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
export default InputSlider
