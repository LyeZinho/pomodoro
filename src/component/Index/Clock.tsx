import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

import { Button, ButtonGroup } from '@chakra-ui/react'

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'

import { Heading } from '@chakra-ui/react'

// Pause and resume icons
import { FaPause, FaPlay, FaClock } from 'react-icons/fa'

import { useState, useEffect } from 'react'

import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'

import {
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react'

/*
    Big ircular progress bar on the middle
    Play pause on the middle with remaining time on the middle 
    Below the progress bar, there will be 1 number imput for the pomodoro minutes break
    */
import { useCookies } from "react-cookie";

export default function Clock() {
    const [currentTime, setCurrentTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [breakTime, setBreakTime] = useState(5)

    const [pauseHistory, setPauseHistory] = useState([])

    const [cookies, setCookie] = useCookies(['pause_history']);

    // If cookies is empty or undefined, set it to an empty array
    if (!cookies.pause_history) {
        setCookie('pause_history', []);
    }
    /*
    History:

    [
        "2021-10-10 10:10:10",
        "2021-10-10 10:15:10",
        "2021-10-10 10:20:10",
       ...
    ]
    */

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                console.log(breakTime)  
                if (currentTime >= (60 * breakTime)) {
                    setIsRunning(false)
                    savePause()
                    updateHistory()                    
                } else {
                    setCurrentTime(currentTime => currentTime + 1)
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isRunning])

    const flowHandle = () => {
        if (isRunning) {
            setIsRunning(false)
            savePause()
            updateHistory()
        } else {
            setIsRunning(true)
        }
    }

    const savePause = () => {
        setCookie('pause_history', [...cookies.pause_history, new Date().toISOString()])
    }

    const updateHistory = () => {
        setPauseHistory(cookies.pause_history)
    }

    const handleReset = () => {
        setCurrentTime(0)
        setIsRunning(false)
    }

    const handleBreakDecrement = () => {
        if (breakTime > 1) {
            setBreakTime(breakTime => breakTime - 1)
        }
    }

    const handleBreakIncrement = () => {
        setBreakTime(breakTime => breakTime + 1)
    }

    const averageTimeBetweenBreaks = () => {
        if (pauseHistory.length < 2) {
            return 0
        }

        let total = 0
        for (let i = 1; i < pauseHistory.length; i++) {
            const diff = new Date(pauseHistory[i]).getTime() - new Date(pauseHistory[i - 1]).getTime()
            total += diff
        }

        return total / (pauseHistory.length - 1)
    }

    return (
        <div className='flex flex-col items-center gap-6'>
            <div>
                <CircularProgress
                    value={currentTime}
                    max={breakTime * 60}
                    size="300px"
                    thickness="10px"
                    color="blue.400"
                    capIsRound
                    style={{ padding: '2rem' }}
                >
                    <CircularProgressLabel>
                        {Math.floor((breakTime * 60 - currentTime) / 60)}:
                        {Math.floor((breakTime * 60 - currentTime) % 60).toString().padStart(2, '0')}
                    </CircularProgressLabel>
                </CircularProgress>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
                <ButtonGroup>
                    <Button onClick={flowHandle}>
                        {isRunning ? <FaPause /> : <FaPlay />}
                    </Button>
                    <Button onClick={handleReset}>Reset</Button>
                </ButtonGroup>
                <NumberInput
                    value={breakTime}
                    min={1}
                    max={60}
                    onChange={valueString => setBreakTime(parseInt(valueString))}
                    style={{ width: '120px' }}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper onClick={handleBreakIncrement} />
                        <NumberDecrementStepper onClick={handleBreakDecrement} />
                    </NumberInputStepper>
                </NumberInput>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', justifyContent: "center", alignItems: "center", padding: '2rem'}}>
                <Heading as="h2" size="lg">Pause History</Heading>
                <StatGroup style={{ display: 'flex', gap: '2rem'}}>
                    <Stat>
                        <StatLabel>Average breaks</StatLabel>
                        <StatNumber>{
                            Math.round(averageTimeBetweenBreaks() / 60000)
                            } minutes</StatNumber>
                        <StatHelpText>
                            {pauseHistory.length > 1
                               ? 'This is the average time between breaks.'
                                : 'No recorded pauses yet.'}
                        </StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Total on breaks</StatLabel>
                        <StatNumber>{
                            Math.round(pauseHistory.reduce((total, date) => total + (new Date().getTime() - new Date(date).getTime()), 0) / 60000)
                            } minutes</StatNumber>
                        <StatHelpText>
                            {pauseHistory.length > 1
                               ? 'This is the total time spent on breaks.'
                                : 'No recorded pauses yet.'}
                        </StatHelpText>
                    </Stat>
                </StatGroup>
                <List>
                    {pauseHistory.map((date, index) => (
                        <ListItem key={index}>
                            <ListIcon as={FaClock} />
                            {
                                // Example format: 'October 10, 2021 10:15:30'
                                new Date(date).toLocaleString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
                            }
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    )
}