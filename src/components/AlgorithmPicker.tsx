import React from 'react'
import * as Algorithms from '../models/MazeAlgorithms/Directory'

interface IProps {
    type: Algorithms.Type
    onChange: (type: Algorithms.Type) => void
}

const AlgorithmPicker = ({ type, onChange }: IProps) => {
    return <div>
        {Algorithms.types.map(t => {
            return <div key={t} style={{ fontSize: 48, marginBottom: 20, fontWeight: 800, opacity: t === type ? 1 : 0.3, cursor: 'pointer' }} onClick={() => onChange(t)}>{Algorithms.getName(t)}</div>
        })}
    </div>
}

export default AlgorithmPicker