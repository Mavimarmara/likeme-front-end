import React from 'react';
import { View, TouchableOpacity, TextInput as RNTextInput, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundIconButton } from '@/assets';
import { styles } from './styles';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  showFilterButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChangeText,
  onSearchPress,
  onFilterPress,
  showFilterButton = true,
}) => {
  const handleSearchPress = () => {
    onSearchPress?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <RNTextInput
          placeholder={placeholder}
          placeholderTextColor='rgba(0,0,0,0.48)'
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearchPress}
          returnKeyType='search'
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButtonInside} activeOpacity={0.7} onPress={handleSearchPress}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.searchButtonBackground}
            imageStyle={styles.searchButtonImage}
          >
            <Icon name='search' size={15.5} color='#001137' />
          </ImageBackground>
        </TouchableOpacity>
      </View>
      {showFilterButton && (
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={onFilterPress}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.filterButtonBackground}
            imageStyle={styles.filterButtonImage}
          >
            <Icon name='tune' size={15} color='#001137' />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
