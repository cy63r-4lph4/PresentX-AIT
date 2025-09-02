import { View, Platform, StyleSheet } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BotMessageSquareIcon,
  Home,
  Icon,
  SlidersVertical,
} from "lucide-react-native";
import feedback from "@/app/(tabs)/feedback";
import settings from "@/app/(tabs)/settings";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const icon = {
    index: (isFocused: boolean) => (
      <Home size={24} color={isFocused ? "#fff" : "rgba(155, 196, 249, 1)"} />
    ),
    feedback: (isFocused: boolean) => (
      <BotMessageSquareIcon
        size={24}
        color={isFocused ? "#fff" : "rgba(155, 196, 249, 1)"}
      />
    ),
    settings: (isFocused: boolean) => (
      <SlidersVertical
        size={24}
        color={isFocused ? "#fff" : "rgba(155, 196, 249, 1)"}
      />
    ),
  };
  const style = StyleSheet.create({
    tabbar: {
      position: "absolute",
      flexDirection: "row",
      bottom: 50,
      alignItems: "center",
      marginHorizontal: 60,
      backgroundColor: "rgba(97, 31, 231, 1)",
      paddingVertical: 15,
      borderRadius: 35,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 10,
      shadowOpacity: 0.5,
    },
    tabItem: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
  });

  return (
    <View style={style.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            android_ripple={{ color: "transparent" }}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={style.tabItem}
          >
            {icon[route.name as keyof typeof icon]?.(isFocused)}
            <Text
              style={{ color: isFocused ? "#fff" : "rgba(155, 196, 249, 1)" }}
            >
              {typeof label === "function"
                ? label({
                    focused: isFocused,
                    color: isFocused ? colors.primary : colors.text,
                    position: "below-icon",
                    children: "",
                  })
                : label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
