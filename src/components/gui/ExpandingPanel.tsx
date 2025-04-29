import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { ReactElement } from 'react'
import * as React from 'react'
import type { Merge } from 'type-fest'

export type ExpandMoreProps = Merge<
    IconButtonProps,
    {
        expand?: boolean
    }
>

export type ExpandingPanelProps = Merge<
    ExpandMoreProps,
    {
        children?: ReactElement
        width?: string
    }
>

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand = false, ...other } = props
    return <IconButton {...other} />
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }): boolean => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }): boolean => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}))

export default function ExpandingPanel({
    children,
    expand = false,
    width = '50%',
}: ExpandingPanelProps): ReactElement {
    const [expanded, setExpanded] = React.useState(false)

    const handleExpandClick = (): void => {
        setExpanded(!expanded)
    }

    return (
        <Card style={{ position: 'absolute', width: width }}>
            <CardHeader
                action={
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more">
                        <ExpandMoreIcon />
                    </ExpandMore>
                }
                title="Control Panel"
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>{children}</CardContent>
            </Collapse>
        </Card>
    )
}
