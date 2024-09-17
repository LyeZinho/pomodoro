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

export default function Clock(){
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
                setCurrentTime(currentTime => currentTime + 1)
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

    return (
        <div className=''
        style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
        >
            <div>
                <CircularProgress
                    value={currentTime}
                    max={breakTime * 60}
                    size="300px"
                    thickness="10px"
                    color="blue.400"
                    className='flex items-center justify-center'
                    capIsRound
                >
                    <CircularProgressLabel>
                        {Math.floor((breakTime * 60 - currentTime) / 60)}:
                        {Math.floor((breakTime * 60 - currentTime) % 60).toString().padStart(2, '0')}
                    </CircularProgressLabel>
                </CircularProgress>
            </div>
            <div className=''
            style={{display: 'flex', gap: '1rem'}}
            >
                <ButtonGroup>
                    <Button onClick={flowHandle}>
                        {isRunning? <FaPause /> : <FaPlay />}
                    </Button>
                    <Button onClick={handleReset}>Reset</Button>
                </ButtonGroup>
            </div>
            <div>
                <Heading as="h2" size="lg">Break Time</Heading>
                <NumberInput
                    value={breakTime}
                    min={1}
                    max={60}
                    onChange={valueString => setBreakTime(parseInt(valueString))}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper onClick={handleBreakIncrement} />
                        <NumberDecrementStepper onClick={handleBreakDecrement} />
                    </NumberInputStepper>
                </NumberInput>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <Heading as="h2" size="lg">Pause History</Heading>
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