import React from 'react'
import Command from './BaseCommand'
import Controller from '../controller/controller'
import Character from './Character'

const commands: Command[] = [Character]

export const useKeyboardCommands = (controller: Controller) => {
    const onKeypress = React.useCallback((e: KeyboardEvent) => {
        const command = commands.find(c => c.matches(controller, e))
        if (command) {
            command.do(controller, e)
            e.preventDefault()
        }
    }, [controller])
    React.useEffect(() => {
        window.addEventListener('keydown', onKeypress)
        return () => window.removeEventListener('keydown', onKeypress)
    }, [onKeypress])
}