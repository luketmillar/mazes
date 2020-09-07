import React from 'react'
import Controller from '../controller/controller'
import Save from '../commands/Save'
import { useLayoutType, LayoutType } from './useLayout'
import ArrowSrc from './arrow.png'

const getImageSizeRatio = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
            return 1.7
        case LayoutType.iPadSmall:
            return 1.6
        case LayoutType.PhoneLandscape:
        case LayoutType.PhonePortrait:
            return 1.6
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

const getRight = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
        case LayoutType.iPadSmall:
            return 100
        case LayoutType.PhoneLandscape:
        case LayoutType.PhonePortrait:
            return 0
    }
}


const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent")
        return true
    } catch (e) {
        return false
    }
}

const getText = () => {
    if (isTouchDevice()) {
        return ["Long press to", "save your image"]
    } else {
        return ["Click to", "save your image"]
    }
}

const Winner = ({ nextLevel, controller }: { nextLevel: () => void, controller: Controller }) => {
    const layoutType = useLayoutType()
    const { width, height } = controller.screenSize
    const url = React.useMemo(() => {
        return Save.getImageUrl(controller)
    }, [controller])
    const imageSizeRatio = getImageSizeRatio(layoutType)
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', borderRadius: 20, boxShadow: '0 5px 15px rgba(0,0,0,.5)', width: width * 0.75, height: height * 0.75 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
                {url && <a href={url} download="amaze.fun.png"><img style={{ width: width / imageSizeRatio, height: height / imageSizeRatio }} src={url} alt="Level screenshot" /></a>}
                <div style={{
                    fontSize: getButtonFontSize(layoutType),
                    color: 'white',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                    bottom: -100,
                    right: getRight(layoutType)
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transform: 'rotate(10deg)',
                    }}>
                        {getText().map((line, i) => {
                            return <div key={i} style={{
                                padding: '6px 16px',
                                backgroundColor: '#E1219B',
                                boxShadow: '3px 3px 5px rgba(0,0,0,0.5)',
                                marginBottom: 5,
                                whiteSpace: 'nowrap',
                                width: 'fit-content'
                            }}>{line}</div>
                        })}
                    </div>
                    <img style={{ transform: 'translateY(-60px)', width: 100 }} src={ArrowSrc} alt="arrow" />
                </div>
            </div>
        </div>
    </div>
}

export default Winner