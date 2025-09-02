import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const OnboardingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Welcome to PresentX',
                    headerShown: false,
                    contentStyle: { backgroundColor: '#fff' },
                }}
            />
            <Stack.Screen       
                name="login"
                options={{
                    title: 'Login',
                    headerShown: false,
                    contentStyle: { backgroundColor: '#ffff' },
                }}
            />
        </Stack>
      )
}

export default OnboardingLayout