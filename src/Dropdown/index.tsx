import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Surface,
  Divider,
  HelperText,
  Searchbar,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {
  View,
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Lo from 'lodash';

import Item from '../Components/Item';
import { defaultDropdownProps, ITEMLAYOUT } from '../constants';
import type { IDropdownData, IDropdownProps } from '../types';
import styles from '../styles';
import { deviceWidth, deviceHeight } from '../util';
import EmptyList from '../Components/EmptyList';
import PressableTouch from '../Components/PressableTouch';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    colors: {
      primary: '#6200ee',
      accent: '#03dac4',
      background: '#f6f6f6',
      surface: '#FFFFFF',
      error: '#B00020',
      text: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      placeholder: 'rgba(0,0,0,0.54)',
      disabled: 'rgba(0,0,0,0.26)',
    },
  },
  dark: true,
};

const Dropdown: React.FC<IDropdownProps> = props => {
  const {
    error,
    value,
    label,
    required,
    disabled,
    data,
    onChange,
    floating,
    enableSearch,
    primaryColor,
    elevation,
    borderRadius,
    activityIndicatorColor,
    searchPlaceholder,
    rippleColor,
    helperText,
    errorColor,
    itemTextStyle,
    itemContainerStyle,
    showLoader,
    animationIn = 'fadeIn',
    animationOut = 'fadeOut',
    supportedOrientations = ['portrait', 'landscape'],
    animationInTiming = 1,
    animationOutTiming,
    parentDDContainerStyle,
    emptyListText,
    disableSort,
    enableAvatar,
    avatarSize,
    defaultSortOrder = 'asc',
    onBlur,
    paperTheme,
    textInputStyle,
    mainContainerStyle,
    underlineColor,
    disableSelectionTick,
    textInputPlaceholder,
    textInputPlaceholderColor,
    selectedItemTextStyle,
    selectedItemViewStyle,
    removeLabel,
    mode = 'flat',
    iconDropDown,
    InputComponent,
    isShow,
    setIsShow,
    propsItem
  } = props;
  const [selected, setSelected] = useState<string | number>();
  const [labelv, setLabelV] = useState<string>('');
  const [, setIconColor] = useState<string | undefined>('grey');
  const [options, setOptions] = useState<IDropdownData[]>([]);
  const [hasError, setError] = useState<boolean>(false);
  const [contMeasure, setConMeasure] = useState({
    vx: 0,
    vy: 0,
    vWidth: 0,
    vHeight: 0,
  });
  const [dimension, setDimension] = useState({
    dw: deviceWidth,
    dh: deviceHeight,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pViewRef = useRef<View | any>();
  const listRef = useRef<FlatList | any>();

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setIsShow(false);
      const { width, height } = Dimensions.get('window');
      setDimension({ dw: width, dh: height });
      setIconColor('grey');
    });
    return () => {
      Dimensions.removeEventListener('change', () => {});
    };
  }, []);

  useEffect(() => {
    if (!Lo.isEmpty(data) && value) {
      const lFilter = Lo.filter(data, { value: value })[0];
      if (!Lo.isEmpty(lFilter)) setLabelV(lFilter.label);
    }
  }, [value, data]);

  useEffect(() => {
    if (disabled) {
      setIconColor('lightgrey');
    }
  }, [disabled]);

  useEffect(() => {
    if (isShow && listRef) {
      listRef.current.flashScrollIndicators();
    }
  }, [isShow]);

  useEffect(() => {
    if (!disableSort)
      setOptions(Lo.orderBy(data, ['label'], [defaultSortOrder]));
    else setOptions(data);
  }, [data, disableSort, defaultSortOrder]);

  useEffect(() => {
    if (isShow && selected) {
      const selectedIndex = Lo.findIndex(options, { value: selected });
      if (selectedIndex >= 0 && listRef) {
        // setTimeout(() => {
        //   listRef.current.scrollToIndex({
        //     animated: false,
        //     index: selectedIndex,
        //     viewPosition: Platform.OS === 'android' ? 0 : 0.5,
        //   });
        // }, 100);
      }
    }
  }, [selected, options, isShow]);

  useEffect(() => {
    if (required && error) {
      setError(true);
      setIconColor(errorColor);
    } else {
      setError(false);
      setIconColor('grey');
    }
  }, [required, error, errorColor]);

  const onTextInputFocus = () => {
    if (hasError) {
      setIconColor('red');
    } else {
      setIconColor(primaryColor);
    }
    pViewRef.current.measureInWindow(
      (vx: number, vy: number, vWidth: number, vHeight: number) => {
        const ddTop = vy + vHeight;
        const bottomMetric = dimension.dh - vy;
        if (bottomMetric < deviceHeight * 0.3) {
          setConMeasure({ vx, vy: ddTop - deviceHeight*0.09, vWidth, vHeight });
        } else {
          setConMeasure({ vx, vy: ddTop, vWidth, vHeight });
        }
      }
    );
    setIsShow(true);
  };

  const androidOnLayout = () => {
    if (Platform.OS === 'android') {
      pViewRef.current.measureInWindow(
        (vx: number, vy: number, vWidth: number, vHeight: number) => {
          const ddTop = vy + vHeight;
          const bottomMetric = dimension.dh - vy;
          if (bottomMetric < deviceHeight * 0.3) {
            setConMeasure({ vx, vy: ddTop - deviceHeight*0.1, vWidth, vHeight });
          } else {
            setConMeasure({ vx, vy: ddTop, vWidth, vHeight });
          }
        }
      );
    }
  };

  const onModalBlur = () => {
    setIsShow(false);
    if (hasError) {
      setIconColor('red');
    } else {
      setIconColor('grey');
    }
    if (onBlur && typeof onBlur === 'function') onBlur();
  };

  const handleOptionSelect = (v: string | number) => {
    const lFilter = Lo.filter(data, { value: v })[0];
    if (!Lo.isEmpty(lFilter)) setLabelV(lFilter.label);
    setSelected(v);
    if (onChange && typeof onChange === 'function') {
      onChange(v);
      setIsShow(false);
    }
    if (hasError) {
      setIconColor('red');
    } else {
      setIconColor('grey');
    }
    setSearchQuery('');

    if (!disableSort)
      setOptions(Lo.orderBy(data, ['label'], [defaultSortOrder]));
    else setOptions(data);
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (!Lo.isEmpty(data) && query) {
      const lFilter = data.filter(opt =>
        opt.label
          .toString()
          .toLowerCase()
          .trim()
          .includes(query.toString().toLowerCase())
      );
      if (lFilter.length === 0) {
        setOptions([]);
      } else {
        setOptions(lFilter);
      }
    } else if (!Lo.isEmpty(data) && !query && !disableSort) {
      setOptions(Lo.sortBy(data, 'label'));
    } else setOptions(data);
  };

  const getEmptyComponent = () => {
    if (typeof emptyListText === 'string')
      return <EmptyList emptyItemMessage={emptyListText} />;
    else return <>{emptyListText}</>;
  };

  const labelAction = () => {
    if (removeLabel) {
      return '';
    } else {
      return required ? `${label}*` : label;
    }
  };

  return (
    <PaperProvider theme={paperTheme || theme}>
      <View>
        <PressableTouch
          onPress={onTextInputFocus}
          disabled={disabled}
          rippleColor={rippleColor}
        >
          <View
            style={[styles.fullWidth, mainContainerStyle]}
            ref={pViewRef}
            onLayout={androidOnLayout}
            pointerEvents="none"
          >
           {!!InputComponent ? InputComponent : (
              <TextInput
              label={labelAction()}
              placeholder={textInputPlaceholder}
              placeholderTextColor={textInputPlaceholderColor}
              value={labelv}
              style={[styles.textInput, textInputStyle]}
              underlineColor={underlineColor}
              underlineColorAndroid={underlineColor}
              editable={false}
              error={hasError}
              disabled={disabled}
              theme={{
                colors: { primary: primaryColor, error: errorColor },
                dark: false,
              }}
              right={
                iconDropDown
              }
              mode={mode}
            />
           )}
          </View>
          {required && hasError ? (
            <HelperText
              type="error"
              theme={{ colors: { error: errorColor } }}
              visible={hasError}
            >
              {helperText ? helperText : `${label} is required`}
            </HelperText>
          ) : null}
        </PressableTouch>
        {isShow && (
          <Modal
          isVisible={true}
          onBackdropPress={onModalBlur}
          backdropColor={floating ? 'rgba(0,0,0,0.1)' : 'transparent'}
          style={styles.modalStyle}
          animationIn={'pulse'}
          animationOut={animationOut}
          animationInTiming={1}
          animationOutTiming={1}
          supportedOrientations={supportedOrientations}
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          backdropOpacity={1}
          useNativeDriver={true}
        >
          <View
            style={{
              backgroundColor: 'transparent',
              width: !floating ? contMeasure.vWidth : 'auto',
              left: !floating ? contMeasure.vx : 0,
              top: !floating ? contMeasure.vy : 100,
              right: 0,
              position: 'absolute',
              padding: floating ? 20 : 0,
            }}
          >
            <Surface
              style={[
                styles.surface,
                { elevation, borderRadius },
                floating ? { maxHeight: dimension.dh / 2 } : null,
                parentDDContainerStyle,

              ]}
            >
              {showLoader ? (
                <View style={[styles.loader, { borderRadius }]}>
                  <ActivityIndicator
                    size="small"
                    color={activityIndicatorColor}
                  />
                </View>
              ) : null}
              <FlatList
                ref={listRef}
                data={options}
                initialNumToRender={50}
                showsVerticalScrollIndicator={false}
                // maxToRenderPerBatch={25}
                persistentScrollbar
                scrollEnabled={!showLoader}
                ListHeaderComponent={
                  enableSearch ? (
                    <View>
                      <Searchbar
                        placeholder={searchPlaceholder}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        theme={{ colors: { primary: primaryColor } }}
                        style={{
                          elevation: 0,
                          backgroundColor: showLoader
                            ? 'transparent'
                            : '#FFFFFF',
                          height: ITEMLAYOUT,
                        }}
                      />
                      <Divider style={styles.divider} />
                    </View>
                  ) : null
                }
                stickyHeaderIndices={enableSearch ? [0] : undefined}
                renderItem={({ item, index }) => (
                  <Item
                    item={item}
                    isLast={index === options.length - 1}
                    onSelect={handleOptionSelect}
                    selected={value}
                    selectedColor={primaryColor}
                    itemTextStyle={itemTextStyle}
                    itemContainerStyle={itemContainerStyle}
                    rippleColor={rippleColor}
                    disabled={showLoader}
                    enableAvatar={enableAvatar}
                    avatarSize={avatarSize}
                    disableSelectionTick={disableSelectionTick}
                    selectedItemTextStyle={selectedItemTextStyle}
                    selectedItemViewStyle={selectedItemViewStyle}
                    propsItem={propsItem}
                  />
                )}
                keyExtractor={() => Math.random().toString()}
                ItemSeparatorComponent={() => (
                  <Divider style={styles.divider} />
                )}
                getItemLayout={(_d, index) => ({
                  length: ITEMLAYOUT,
                  offset: ITEMLAYOUT * index,
                  index,
                })}
                ListEmptyComponent={getEmptyComponent()}
              />
            </Surface>
          </View>
        </Modal>
        )}
      </View>
    </PaperProvider>
  );
};

Dropdown.defaultProps = defaultDropdownProps;

export default Dropdown;
