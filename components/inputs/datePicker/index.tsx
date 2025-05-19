import { Text, View } from "react-native";

// Add error prop to DatePicker component
type Props = {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
};

const DatePicker = ({ label, value, onChange, error }: Props) => {
  // ... existing code ...
  
  return (
    <View className="w-full">
      {/* ... existing code ... */}
      
      
    </View>
  );
};