import React from 'react'
import Controller from '../controller/controller'
import Save from '../commands/Save'
import { useLayoutType, LayoutType } from './useLayout'

const getFontSize = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
            return 60
        case LayoutType.iPadSmall:
            return 48
        case LayoutType.PhoneLandscape:
        case LayoutType.PhonePortrait:
            return 24
    }
}

const getImageSizeRatio = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
            return 1.7
        case LayoutType.iPadSmall:
            return 2
        case LayoutType.PhoneLandscape:
            return 2.5
        case LayoutType.PhonePortrait:
            return 2
    }
}

const getButtonFontSize = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
            return 38
        case LayoutType.iPadSmall:
            return 32
        case LayoutType.PhoneLandscape:
        case LayoutType.PhonePortrait:
            return 16
    }
}

const Winner = ({ nextLevel, controller }: { nextLevel: () => void, controller: Controller }) => {
    const layoutType = useLayoutType()
    const { width, height } = controller.canvasSize
    const url = React.useMemo(() => {
        return Save.getImageUrl(controller)
    }, [controller])
    const imageSizeRatio = getImageSizeRatio(layoutType)
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', borderRadius: 20, boxShadow: '0 5px 15px rgba(0,0,0,.5)', width: width * 0.9, height: height * 0.9 }}>
            <div style={{ padding: '30px 40px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ fontWeight: 600, fontSize: getFontSize(layoutType), color: 'black' }}>You won!</div>
                {url && <img style={{ width: width / imageSizeRatio, height: height / imageSizeRatio }} src={url} alt="Level screenshot" />}
                <div style={{ display: 'flex' }}>
                    <a href={url} download="maze.png" style={{ fontSize: getButtonFontSize(layoutType) }}>Save proof</a>
                    <div style={{ width: 20 }} />
                    <button onClick={nextLevel} style={{ fontSize: getButtonFontSize(layoutType) }}>New level</button>
                </div>
            </div>
        </div>
    </div>
}

export default Winner