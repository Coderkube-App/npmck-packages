import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  Keyboard,
  Modal,
  StatusBar,
} from 'react-native';
import { usePaginatedSearch, LoadOptions } from './usePaginatedSearch';

export interface PaginatedSearchDropdownProps<T, Additional = unknown> {
  loadOptions: LoadOptions<T, Additional>;
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  onSelect: (item: T) => void;
  
  placeholder?: string;
  debounceTimeout?: number;
  initialAdditional?: Additional;
  
  // Custom Styles
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  menuStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
  
  // Custom Components
  renderNoResults?: () => React.ReactElement;
  renderLoading?: () => React.ReactElement;
  renderFooter?: () => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  
  // Controls
  closeOnSelect?: boolean;
}

export interface PaginatedSearchDropdownHandle {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setSearch: (text: string) => void;
}

const PaginatedSearchDropdownInner = <T extends unknown, Additional = unknown>(
  props: PaginatedSearchDropdownProps<T, Additional>,
  ref: React.ForwardedRef<PaginatedSearchDropdownHandle>
) => {
  const {
    loadOptions,
    renderItem,
    keyExtractor,
    onSelect,
    placeholder = 'Search...',
    debounceTimeout = 300,
    initialAdditional,
    containerStyle,
    inputStyle,
    menuStyle,
    itemContainerStyle,
    renderNoResults,
    renderLoading,
    renderFooter,
    renderHeader,
    closeOnSelect = true,
  } = props;

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const inputRef = React.useRef<TextInput>(null);
  const containerRef = React.useRef<View>(null);

  const {
    search,
    setSearch,
    options,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = usePaginatedSearch({
    loadOptions,
    debounceTimeout,
    initialAdditional,
  });

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => setSearch(''),
    setSearch: (text: string) => setSearch(text),
  }));

  const handleOpenMenu = () => {
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setInputLayout({ x: pageX, y: pageY, width, height });
      setIsMenuVisible(true);
    });
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    if (closeOnSelect) {
      setIsMenuVisible(false);
      Keyboard.dismiss();
    }
  };

  const internalRenderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#6366F1" />
        </View>
      );
    }
    return renderFooter ? renderFooter() : null;
  };

  const renderDropdownContent = () => {
    if (isLoading && !options.length) {
      return renderLoading ? (
        renderLoading()
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      );
    }

    return (
      <FlatList
        data={options}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }: { item: T; index: number }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={[styles.item, itemContainerStyle]}
          >
            {renderItem(item, index)}
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() =>
          !isLoading ? (
            renderNoResults ? (
              renderNoResults()
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )
          ) : null
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={internalRenderFooter}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        persistentScrollbar={true}
      />
    );
  };

  return (
    <View ref={containerRef} style={[styles.container, containerStyle]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={search}
        onChangeText={(text: string) => {
          setSearch(text);
          if (!isMenuVisible) handleOpenMenu();
        }}
        onFocus={handleOpenMenu}
      />

      {isMenuVisible && (
        <>
          {/* Backdrop (iOS/Web) or Modal (Android) */}
          {Platform.OS === 'android' ? (
            <Modal
              transparent
              visible={isMenuVisible}
              animationType="none"
              onRequestClose={() => setIsMenuVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => setIsMenuVisible(false)}
              >
                <View style={[
                  styles.menu, 
                  menuStyle, 
                  styles.androidMenu,
                  { 
                    top: inputLayout.y + inputLayout.height - (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0),
                    left: inputLayout.x,
                    width: inputLayout.width 
                  }
                ]}>
                  {renderDropdownContent()}
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            <>
              <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={() => setIsMenuVisible(false)}
              />
              <View style={[styles.menu, menuStyle]}>
                {renderDropdownContent()}
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

export const PaginatedSearchDropdown = forwardRef(PaginatedSearchDropdownInner) as <
  T extends unknown,
  Additional = unknown
>(
  props: PaginatedSearchDropdownProps<T, Additional> & {
    ref?: React.ForwardedRef<PaginatedSearchDropdownHandle>;
  }
) => React.ReactElement;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  androidMenu: {
    position: 'absolute',
    // Position will be handled via calculated layout
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
    zIndex: 1001,
  },
  menu: {
    position: 'absolute',
    top: 48, // Adjusted from 52 to be flush with the input height
    left: 0,
    right: 0,
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 1001,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8, // Increased elevation for Android
      },
    }),
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  noResults: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#64748B',
    fontSize: 14,
  },
});
