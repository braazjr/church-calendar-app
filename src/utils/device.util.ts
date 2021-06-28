import { getStatusBarHeight } from 'react-native-status-bar-height';

const hasNotch = () => {
    return getStatusBarHeight() > 24
}

export {
    hasNotch
}