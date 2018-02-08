/* @flow */

import { StyleSheet, Platform } from 'react-native'
import { isIPhoneX } from '../utils/iPhoneXUtils'

const styles: Object = StyleSheet.create({
  container: {
    flex: 1
  },
  topStepper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    ...Platform.select({
      ios: {
        marginVertical: 12,
        shadowOpacity: 0.1,
        shadowRadius: 0.54 * 3,
        shadowOffset: {
          height: 0.6 * 3
        }
      },
      android: {
        height: 64,
        marginBottom: 12
      }
    }),
    backgroundColor: 'white'
  },
  bottomStepper: {
    ...Platform.select({
      ios: {
        alignItems: 'center',
        shadowOpacity: 1,
        shadowRadius: 0.54 * 3,
        shadowOffset: {
          height: 0.6 * 3
        },
        height: isIPhoneX ? 74 : 50
      },
      android: { height: 50 }
    }),
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 12
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dotsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 0
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: 'red',
    marginHorizontal: 5
  },
  steps: {
    width: 30,
    height: 30,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 20
  },
  stepTitle: {
    fontFamily: 'Avenir'
  },
  stepContainer: {
    alignItems: 'center',
    marginHorizontal: 5
  },
  bottomTextButtons: {
    ...Platform.select({
      ios: {
        fontFamily: 'Avenir'
      },
      android: {
        fontFamily: 'Roboto'
      }
    })
  }
})

export { styles }
