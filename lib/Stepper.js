/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  ViewPagerAndroid,
  Platform,
  View,
  Text,
  ScrollView,
  ViewPropTypes,
  Alert
} from 'react-native'
import PlatformTouchableNative from 'react-native-platform-touchable'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { styles } from './styles/styles'

type Props = {
  children: any,
  initialPage: number,
  onPressNext?: Function,
  onPressBack?: Function,
  onScrollPage?: Function,
  textButtonsStyle?: Object | number,
  backButtonTitle?: string,
  nextButtonTitle?: string,
  topStepperStyle?: Object | number,
  showTopStepper?: boolean,
  activeDotStyle?: Object | number,
  inactiveDotStyle?: Object | number,
  childrenStyle?: Object | number,
  activeStepStyle?: Object | number,
  inactiveStepStyle?: Object | number,
  steps?: Array<string>,
  stepsTitleStyle?: Object | number,
  showBottomStepper?: boolean,
  bottomStepperStyle?: Object | number,
  activeStepNumberStyle?: Object | number,
  inactiveStepNumberStyle?: Object | number,
  activeStepTitleStyle?: Object | number,
  inactiveStepTitleStyle?: Object | number,
  validate?: boolean,
  bottomNavigationLeftIconComponent?: React$Element<any>,
  bottomNavigationRightIconComponent?: React$Element<any>
}
type State = {
  showBack: boolean,
  showNext: boolean,
  width: number,
  height: number,
  page: number,
  error: boolean
}

class Stepper extends React.Component<Props, State> {
  viewPager: ViewPagerAndroid
  scrollView: ScrollView

  static propTypes = {
    ...ViewPagerAndroid.propTypes,
    ...ScrollView.propTypes,
    initialPage: PropTypes.number,
    onPressNext: PropTypes.func,
    onPressBack: PropTypes.func,
    textButtonsStyle: Text.propTypes.style,
    backButtonTitle: PropTypes.string,
    nextButtonTitle: PropTypes.string,
    topStepperStyle: ViewPropTypes.style,
    showTopStepper: PropTypes.bool,
    activeDotStyle: ViewPropTypes.style,
    inactiveDotStyle: ViewPropTypes.style,
    childrenStyle: ViewPropTypes.style,
    steps: PropTypes.arrayOf(PropTypes.string.isRequired),
    stepsTitleStyle: ViewPropTypes.style,
    showBottomStepper: PropTypes.bool,
    bottomStepperStyle: ViewPropTypes.style,
    activeStepNumberStyle: Text.propTypes.style,
    inactiveStepNumberStyle: Text.propTypes.style,
    activeStepStyle: ViewPropTypes.style,
    inactiveStepStyle: ViewPropTypes.style,
    activeStepTitleStyle: Text.propTypes.style,
    inactiveStepTitleStyle: Text.propTypes.style,
    onScrollPage: PropTypes.func,
    validate: PropTypes.bool,
    bottomNavigationLeftIconComponent: PropTypes.element,
    bottomNavigationRightIconComponent: PropTypes.element
  }

  static defaultProps = {
    initialPage: 0,
    activeStepColor: 'brown',
    inactiveStepColor: 'grey',
    stepNumberStyle: {
      color: 'white'
    },
    validate: false
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      showBack: props.initialPage > 0 ? true : false,
      showNext: props.initialPage === props.children.length ? false : true,
      page: props.initialPage,
      width: 0,
      height: 0,
      error: false
    }
  }

  /**
   * Handles page change event
   * @param e
   */
  onPageSelected = (e: Object) => {
    if (Platform.OS === 'android') {
      return this.handleBottomStepper(e.nativeEvent.position)
    }

    // Calculate current index
    const index = e.nativeEvent.contentOffset.x / this.state.width

    // Only call the function if the index is an integer
    if (index === parseInt(index, 10)) {
      if (index < 0 || index >= React.Children.count(this.props.children)) {
        return undefined
      }
      if (this.props.onScrollPage) {
        this.props.onScrollPage()
      }
      this.handleBottomStepper(index)
    }
  }

  /**
   * Handles bottom stepper buttons behaviour
   * @param position
   */
  handleBottomStepper = (position: number) => {
    const numberOfPages: number = this.props.children.length

    this.setState(
      {
        showNext: position === numberOfPages - 1 ? false : true,
        showBack: position === 0 ? false : true,
        page: position
      },
      () => (Platform.OS !== 'ios' ? this.viewPager.setPage(position) : null)
    )
  }

  /**
   * Handles back button behaviour
   */
  onPressBack = () => {
    if (this.props.onPressBack) {
      this.props.onPressBack()
    }

    Platform.OS === 'ios'
      ? this.scrollView.scrollTo({
          x: (this.state.page - 1) * this.state.width,
          animated: true
        })
      : this.handleBottomStepper(this.state.page - 1)
  }

  /**
   * Handles next button behaviour
   */
  onPressNext = () => {
    if (this.props.onPressNext) {
      this.props.onPressNext()
    }

    Platform.OS === 'ios'
      ? this.scrollView.scrollTo({
          x: (this.state.page + 1) * this.state.width,
          animated: true
        })
      : this.handleBottomStepper(this.state.page + 1)
  }

  checkValue = (value: Object) => {
    if (value) {
      this.setState({ error: false })
    } else {
      this.setState({ error: true })
    }
  }

  renderDots = () => {
    let dots = []
    const { activeDotStyle, inactiveDotStyle } = this.props

    for (let index = 0; index < this.props.children.length; index++) {
      const isSelected: boolean = this.state.page === index
      dots.push(
        <View
          style={[styles.dot, isSelected ? activeDotStyle : inactiveDotStyle]}
          key={index}
        />
      )
    }
    return <View style={styles.dotsContainer}>{dots}</View>
  }

  /**
   * Set the page dimensions
   * @param e
   */
  setDimensions = (e: Object) => {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height
    })
  }

  /**
   * Render each child view in the ViewPager
   * @returns {*}
   */
  renderChildren = () => {
    const { children, childrenStyle } = this.props

    return React.Children.map(children, (child: Object, index: number) => {
      return (
        <View
          key={`child${index}`}
          style={[
            styles.container,
            { width: this.state.width, height: this.state.height },
            childrenStyle
          ]}>
          {child}
        </View>
      )
    })
  }

  renderSteps = () => {
    const {
      activeStepStyle,
      inactiveStepStyle,
      steps,
      activeStepTitleStyle,
      inactiveStepTitleStyle,
      activeStepNumberStyle,
      inactiveStepNumberStyle
    } = this.props

    if (steps) {
      return steps.map((step: string, index: number) => {
        const isSelected: boolean = this.state.page === index
        return (
          <View key={`step${index}`} style={styles.stepContainer}>
            <View
              style={[
                styles.steps,
                isSelected ? activeStepStyle : inactiveStepStyle
              ]}>
              {index < this.state.page && this.props.validate ? (
                this.state.error ? (
                  <MaterialIcon
                    name="close"
                    size={24}
                    style={
                      isSelected
                        ? activeStepNumberStyle
                        : inactiveStepNumberStyle
                    }
                  />
                ) : (
                  <MaterialIcon
                    name="check"
                    size={24}
                    style={
                      isSelected
                        ? activeStepNumberStyle
                        : inactiveStepNumberStyle
                    }
                  />
                )
              ) : (
                <Text
                  style={
                    isSelected ? activeStepNumberStyle : inactiveStepNumberStyle
                  }>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepTitle,
                isSelected ? activeStepTitleStyle : inactiveStepTitleStyle
              ]}>
              {step}
            </Text>
          </View>
        )
      })
    }
    return null
  }

  /**
   * Render a ScrollView on iOS
   * @returns {React.ReactChild}
   */
  renderViewPager = () => {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          {...this.props}
          ref={(ref: any) => {
            this.scrollView = ref
          }}
          horizontal={true}
          pagingEnabled={true}
          removeClippedSubviews={true}
          directionalLockEnabled={true}
          scrollEventThrottle={120}
          bounces={false}
          scrollsToTop={false}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={this.onPageSelected}
          onLayout={this.setDimensions}
          contentOffset={{
            x: this.state.width * this.props.initialPage,
            y: 0
          }}>
          {this.renderChildren()}
        </ScrollView>
      )
    }
    return (
      <ViewPagerAndroid
        {...this.props}
        ref={(ref: any) => {
          this.viewPager = ref
        }}
        style={styles.container}
        onPageSelected={this.onPageSelected}>
        {this.renderChildren()}
      </ViewPagerAndroid>
    )
  }

  render() {
    const {
      showTopStepper,
      showBottomStepper,
      textButtonsStyle,
      backButtonTitle,
      nextButtonTitle,
      topStepperStyle,
      bottomStepperStyle,
      bottomNavigationLeftIconComponent,
      bottomNavigationRightIconComponent
    } = this.props
    const { showBack, showNext } = this.state
    return (
      <View style={styles.container}>
        {showTopStepper ? (
          <View style={[styles.topStepper, topStepperStyle]}>
            {this.renderSteps()}
          </View>
        ) : null}
        {this.renderViewPager()}
        {showBottomStepper ? (
          <View
            style={[
              styles.bottomStepper,
              {
                justifyContent: showBack ? 'space-between' : 'flex-end'
              },
              bottomStepperStyle
            ]}>
            {showBack ? (
              <PlatformTouchableNative
                onPress={this.onPressBack}
                background={PlatformTouchableNative.SelectableBackgroundBorderless()}
                style={{ zIndex: 1 }}>
                <View style={styles.button}>
                  {bottomNavigationLeftIconComponent || (
                    <MaterialIcon name="navigate-before" size={24} />
                  )}
                  <Text style={[styles.bottomTextButtons, textButtonsStyle]}>
                    {backButtonTitle}
                  </Text>
                </View>
              </PlatformTouchableNative>
            ) : null}
            {this.renderDots()}
            {showNext ? (
              <PlatformTouchableNative
                onPress={this.onPressNext}
                background={PlatformTouchableNative.SelectableBackgroundBorderless()}
                style={{ zIndex: 1 }}>
                <View style={styles.button}>
                  <Text style={[styles.bottomTextButtons, textButtonsStyle]}>
                    {nextButtonTitle}
                  </Text>
                  {bottomNavigationRightIconComponent || (
                    <MaterialIcon name="navigate-next" size={24} />
                  )}
                </View>
              </PlatformTouchableNative>
            ) : null}
          </View>
        ) : null}
      </View>
    )
  }
}

export default Stepper
