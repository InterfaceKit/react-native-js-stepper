/* @flow */

import { Dimensions, Platform } from 'react-native'

// Taken from: https://mydevice.io/devices/
const X_WIDTH: number = 375
const X_HEIGHT: number = 812

function isIPhoneX(): boolean {
  return (
    Platform.OS === 'ios' &&
    ((Dimensions.get('window').height === X_HEIGHT &&
      Dimensions.get('window').width === X_WIDTH) ||
      (Dimensions.get('window').height === X_WIDTH &&
        Dimensions.get('window').width === X_HEIGHT))
  )
}

function iPhoneXStyle(iPhoneXStyle: Object, style?: Object): Object {
  if (isIPhoneX()) {
    return iPhoneXStyle
  }
  return style || {}
}

export { isIPhoneX, iPhoneXStyle }
