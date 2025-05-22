import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

type MultiSelectProps = {
  label?: string;
  options?: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  freeType?: boolean;
};

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select',
  error,
  freeType = false,
}: MultiSelectProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  
  // Check if options is valid array with items
  const hasOptions = Array.isArray(options) && options.length > 0;

  // Filter options based on input and already selected values
  useEffect(() => {
    // If not in free type mode and no options, just set empty array and return
    if (!freeType && (!options || options.length === 0)) {
      setFilteredOptions([]);
      return;
    }
    
    if (freeType) {
      // In free type mode, filter based on input
      if (inputValue.trim()) {
        // Only filter if we have options to filter
        const filtered = hasOptions 
          ? options.filter(
              option => 
                option.toLowerCase().includes(inputValue.toLowerCase()) && 
                !value.includes(option)
            )
          : [];
        
        // Add the current input as an option if it's not already in the options
        if (
          inputValue.trim() && 
          !value.includes(inputValue) &&
          (!filtered.includes(inputValue))
        ) {
          setFilteredOptions([inputValue, ...filtered]);
        } else {
          setFilteredOptions(filtered);
        }
        
        // Keep dropdown open when there's input text in free type mode
        setIsOpen(true);
      } else {
        // If no input text, show all unselected options or empty list
        setFilteredOptions(hasOptions ? options.filter(option => !value.includes(option)) : []);
        setIsOpen(false);
      }
    } else if (hasOptions) {
      // In dropdown mode, only show options that haven't been selected yet
      setFilteredOptions(options.filter(option => !value.includes(option)));
    }
  }, [inputValue, value, freeType, hasOptions]);

  // Animation for dropdown
  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    // Close keyboard when dropdown closes
    if (!isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen, dropdownAnimation]);

  const toggleDropdown = () => {
    // For non-free type mode OR free type mode with options, toggle dropdown on click
    if (!freeType || (freeType && hasOptions)) {
      setIsOpen(!isOpen);
    }
    
    // In free type mode, always focus the input
    if (freeType) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSelect = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemove = (option: string) => {
    onChange(value.filter(item => item !== option));
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    // In free type mode, only open dropdown when there's text
    if (freeType) {
      setIsOpen(text.trim().length > 0);
    }
  };

  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(filteredOptions.length * 40, 200)],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontFamily: 'Poppins_Medium',
            marginBottom: 8,
            color: isDark ? 'white' : Colors.light.text,
          }}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleDropdown}
        style={{
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#E5E7EB',
          borderRadius: 8,
          padding: 12,
          backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {freeType ? (
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={handleInputChange}
              placeholder={placeholder}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              style={{
                flex: 1,
                color: isDark ? 'white' : 'black',
                fontFamily: 'Inter',
                padding: 0,
              }}
              onFocus={() => {
                // Always open dropdown on focus if there are options in free type mode
                if (freeType && hasOptions) {
                  setIsOpen(true);
                } else if (inputValue.trim()) {
                  setIsOpen(true);
                }
              }}
            />
          ) : (
            <Text
              style={{
                flex: 1,
                color: isDark ? '#9CA3AF' : '#6B7280',
                fontFamily: 'Inter',
              }}
            >
              {placeholder}
            </Text>
          )}
          
          {/* Only show dropdown icon when options exist */}
          {hasOptions && (
            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          )}
        </View>
      </TouchableOpacity>
      
      {/* Dropdown */}
      <Animated.View
        style={{
          height: dropdownHeight,
          overflow: 'hidden',
          borderWidth: isOpen ? 1 : 0,
          borderColor: isDark ? '#374151' : '#E5E7EB',
          borderRadius: 8,
          marginTop: 4,
          backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
        }}
      >
        <ScrollView nestedScrollEnabled>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              // Check if this is a custom typed option (first item when typing)
              const isCustomOption = freeType && 
                inputValue.trim() && 
                index === 0 && 
                option === inputValue;
                
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(option)}
                  style={{
                    padding: 12,
                    borderBottomWidth: index < filteredOptions.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
                    backgroundColor: isCustomOption 
                      ? (isDark ? '#2D3748' : '#EDF2F7') 
                      : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: isDark 
                        ? (isCustomOption ? '#90CDF4' : '#E2E8F0') 
                        : (isCustomOption ? '#2B6CB0' : '#1A202C'),
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                    }}
                  >
                    {isCustomOption ? `Add "${option}"` : option}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  fontFamily: 'Inter',
                  textAlign: 'center',
                }}
              >
                {freeType 
                  ? 'Type to add a new option' 
                  : 'No options available'}
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
      
      {/* Selected items */}
      {value.filter(item => item.trim() !== '').length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {value.filter(item => item.trim() !== '').map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'Inter',
                  marginRight: 4,
                }}
              >
                {item}
              </Text>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Ionicons name="close" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Error message */}
      {error && (
        <Text
          style={{
            color: '#EF4444',
            fontSize: 12,
            marginTop: 4,
            fontFamily: 'Inter',
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default MultiSelect;