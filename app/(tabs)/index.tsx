import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock workout data
interface WorkoutSection {
  title: string;
  items: string[];
}

interface Workout {
  title: string;
  summary: string;
  sections: WorkoutSection[];
}

const mockWorkouts: Record<string, Workout> = {
  // Today's workout
  [new Date().toISOString().split('T')[0]]: {
    title: 'Strength + Conditioning',
    summary: 'Back Squat + 12-min AMRAP',
    sections: [
      {
        title: 'Warm-up',
        items: [
          '5 min row @ easy pace',
          '10 air squats',
          '10 leg swings each side',
          '10 walking lunges',
          '2×5 back squats @ 50%',
        ],
      },
      {
        title: 'Strength',
        items: [
          'Back Squat: 5×5 @ 80% 1RM',
          'Rest 3 min between sets',
          'Focus on depth and control',
        ],
      },
      {
        title: 'Metcon',
        items: [
          '12-min AMRAP:',
          '15 box jumps (24/20")',
          '20 wall balls (20/14#)',
          '25 double unders',
        ],
      },
      {
        title: 'Accessory',
        items: [
          '3×10 GHD sit-ups',
          '3×15 banded good mornings',
        ],
      },
    ],
  },
  // Tomorrow's workout
  [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: {
    title: 'Endurance + Skill',
    summary: '5K Run + Handstand Practice',
    sections: [
      {
        title: 'Warm-up',
        items: [
          '10 min dynamic stretching',
          '400m jog',
          '10 burpees',
        ],
      },
      {
        title: 'Metcon',
        items: [
          '5K Run for time',
          'Target pace: 7:00/mile',
        ],
      },
      {
        title: 'Skill',
        items: [
          'Handstand hold practice: 5×30s',
          'Wall walks: 3×5',
        ],
      },
    ],
  },
  // Day after tomorrow
  [new Date(Date.now() + 172800000).toISOString().split('T')[0]]: {
    title: 'Olympic Lifting',
    summary: 'Snatch Complex + Conditioning',
    sections: [
      {
        title: 'Warm-up',
        items: [
          '5 min bike',
          'Shoulder mobility circuit',
          'Empty bar snatch drills',
        ],
      },
      {
        title: 'Strength',
        items: [
          'Snatch: 3×3 @ 75%',
          'Snatch pull: 3×3 @ 90%',
        ],
      },
      {
        title: 'Metcon',
        items: [
          'For time:',
          '21-15-9',
          'Snatch (95/65#)',
          'Burpee box jump overs',
        ],
      },
    ],
  },
};

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const isNavigatingRef = useRef(false);

  // Get Sunday of a given date's week
  const getWeekSunday = (date: Date): Date => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const dayOfWeek = normalizedDate.getDay();
    const sunday = new Date(normalizedDate);
    sunday.setDate(normalizedDate.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Initialize with today's week Sunday
  const [currentWeekSunday, setCurrentWeekSunday] = useState(() => {
    return getWeekSunday(new Date());
  });

  // Navigate to next week
  const navigateToNextWeek = useCallback(() => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Calculate new week Sunday
    const nextSunday = new Date(currentWeekSunday);
    nextSunday.setDate(currentWeekSunday.getDate() + 7);
    
    // Calculate new selected date (same day of week)
    const dayOfWeek = selectedDate.getDay();
    const newSelectedDate = new Date(nextSunday);
    newSelectedDate.setDate(nextSunday.getDate() + dayOfWeek);
    newSelectedDate.setHours(0, 0, 0, 0);
    
    // Update both states
    setCurrentWeekSunday(nextSunday);
    setSelectedDate(newSelectedDate);
    
    // Reset navigation lock after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 300);
  }, [currentWeekSunday, selectedDate]);

  // Navigate to previous week
  const navigateToPreviousWeek = useCallback(() => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Calculate new week Sunday
    const prevWeekSunday = new Date(currentWeekSunday);
    prevWeekSunday.setDate(currentWeekSunday.getDate() - 7);
    
    // Calculate new selected date (same day of week)
    const dayOfWeek = selectedDate.getDay();
    const newSelectedDate = new Date(prevWeekSunday);
    newSelectedDate.setDate(prevWeekSunday.getDate() + dayOfWeek);
    newSelectedDate.setHours(0, 0, 0, 0);
    
    // Update both states
    setCurrentWeekSunday(prevWeekSunday);
    setSelectedDate(newSelectedDate);
    
    // Reset navigation lock after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 300);
  }, [currentWeekSunday, selectedDate]);

  // Pan responder for swipe gestures - simpler and more reliable
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // Only respond to horizontal swipes
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx, vx } = gestureState;
          
          // Swipe right (positive dx) = previous week
          if (dx > 50 || vx > 0.5) {
            navigateToPreviousWeek();
          }
          // Swipe left (negative dx) = next week
          else if (dx < -50 || vx < -0.5) {
            navigateToNextWeek();
          }
        },
      }),
    [navigateToNextWeek, navigateToPreviousWeek]
  );

  // Generate exactly 7 days (Sunday-Saturday) for the current week
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const weekSunday = new Date(currentWeekSunday);
    weekSunday.setHours(0, 0, 0, 0);
    
    // Generate all 7 days of the week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(weekSunday);
      weekDay.setDate(weekSunday.getDate() + i);
      weekDay.setHours(0, 0, 0, 0);
      days.push(weekDay);
    }
    
    return days;
  }, [currentWeekSunday]);

  // Calculate card width once to avoid recalculating on every render
  const cardWidth = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 16; // px-2 = 8px each side
    const scrollPadding = 8; // paddingHorizontal: 4 = 4px each side
    const totalMargins = 7; // mx-0.5 = 1px each side * 7 cards = 14px, but simplified
    const availableWidth = screenWidth - containerPadding - scrollPadding - totalMargins;
    return availableWidth / 7;
  }, []);

  // String key for workout lookup
  const workoutDateKey = selectedDate.toISOString().split('T')[0];
  const workout = mockWorkouts[workoutDateKey];

  const formatDateSubtitle = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    
    if (selected.getTime() === today.getTime()) {
      return "Today's Workout";
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selected.getTime() === tomorrow.getTime()) {
      return "Tomorrow's Workout";
    }
    
    return selected.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Memoize selected date timestamp to avoid recalculating
  const selectedDateTimestamp = useMemo(() => {
    const normalized = new Date(selectedDate);
    normalized.setHours(0, 0, 0, 0);
    return normalized.getTime();
  }, [selectedDate]);

  const isSelectedDate = useCallback((date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.getTime() === selectedDateTimestamp;
  }, [selectedDateTimestamp]);

  const handleDateSelect = useCallback((date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const dateTime = normalizedDate.getTime();
    
    // Check if date is already selected to avoid unnecessary updates
    if (dateTime === selectedDateTimestamp) {
      return; // Already selected, no need to update
    }
    
    // Update selected date
    setSelectedDate(normalizedDate);
  }, [selectedDateTimestamp]);

  const getDayShortName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calendar picker functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(calendarMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCalendarMonth(newMonth);
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear(); 
    const month = calendarMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const startDay = firstDay.getDay();
    
    // Get total days in month
    const daysInMonth = lastDay.getDate();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    
    return days;
  };

  const handleCalendarDateSelect = (date: Date) => {
    // Normalize the date (remove time component)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    setSelectedDate(normalizedDate);
    
    // Update to show the week containing the selected date
    const selectedWeekSunday = getWeekSunday(normalizedDate);
    setCurrentWeekSunday(selectedWeekSunday);
    
    // Update calendar month to show the selected date's month
    setCalendarMonth(new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1));
    setShowCalendarPicker(false);
  };



  const handleDone = () => {
    setShowCalendarPicker(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Fixed Header */}
      <View className="px-6 pt-6 pb-4 bg-black">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-4xl font-bold text-white">Training</Text>
          <Pressable 
            onPress={() => {
              setCalendarMonth(selectedDate);
              setShowCalendarPicker(true);
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="#D4AF37" />
          </Pressable>
        </View>
        <Text className="text-lg text-gray-400">{formatDateSubtitle(selectedDate)}</Text>
      </View>

      {/* Fixed Calendar Strip - Swipeable */}
      <View className="px-2 py-4 bg-black" {...panResponder.panHandlers}>
        <View className="flex-row">
          {calendarDays.map((date, index) => {
            const isSelected = isSelectedDate(date);
            const dayName = getDayShortName(date);
            const dayNumber = date.getDate();
            
            return (
              <Pressable
                key={`${date.getTime()}-${index}`}
                onPress={() => handleDateSelect(date)}
                style={{ width: cardWidth }}
                className={`mx-0.5 px-1 py-2.5 rounded-xl items-center ${
                  isSelected 
                    ? 'bg-gray-800 border-2 border-white' 
                    : 'bg-gray-900 border border-gray-700'
                }`}
              >
                <Text className={`text-xs font-semibold mb-0.5 ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}>
                  {dayName}
                </Text>
                <Text className={`text-sm font-bold ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {dayNumber}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Scrollable Workout Content Area */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEnabled={true}
      >
        <View className="px-6 pb-8">
          {workout ? (
            <>
              {/* Summary Card */}
              <View className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <Text className="text-2xl font-bold text-white mb-2">{workout.title}</Text>
                <Text className="text-base text-gray-300">{workout.summary}</Text>
              </View>

              {/* Section Cards */}
              {workout.sections.map((section, index) => (
                <View
                  key={index}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4"
                >
                  <Text className="text-xl font-bold text-white mb-4">{section.title}</Text>
                  <View>
                    {section.items.map((item, itemIndex) => (
                      <View key={itemIndex} className="flex-row items-start mb-2">
                        <Text className="text-gray-400 mr-3 mt-1">•</Text>
                        <Text className="text-gray-300 flex-1 text-base leading-6">{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </>
          ) : (
            /* Empty State */
            <View className="bg-gray-900 border border-gray-800 rounded-2xl p-8 items-center">
              <Text className="text-xl font-bold text-white mb-2">No workout scheduled</Text>
              <Text className="text-base text-gray-400 text-center">Check back later</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Calendar Picker Modal */}
      <Modal
        visible={showCalendarPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable 
            className="flex-1" 
            onPress={() => setShowCalendarPicker(false)}
          />
          <View className="bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 pb-8">
            {/* Calendar Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Pressable onPress={() => navigateMonth('prev')}>
                <Ionicons name="chevron-back" size={24} color="#D4AF37" />
              </Pressable>
              <Pressable>
                <Text className="text-lg font-semibold text-white">
                  {getMonthName(calendarMonth)} {'>'}
                </Text>
              </Pressable>
              <Pressable onPress={() => navigateMonth('next')}>
                <Ionicons name="chevron-forward" size={24} color="#D4AF37" />
              </Pressable>
            </View>

            {/* Days of Week Header */}
            <View className="flex-row mb-4">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <View key={day} className="flex-1 items-center">
                  <Text className="text-xs font-semibold text-gray-400">{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap mb-6">
              {getCalendarDays().map((date, index) => {
                if (!date) {
                  return <View key={index} className="w-[14.28%] aspect-square" />;
                }

                const isSelected = isSelectedDate(date);
                const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();

                return (
                  <Pressable
                    key={index}
                    onPress={() => handleCalendarDateSelect(date)}
                    className={`w-[14.28%] aspect-square items-center justify-center ${
                      isSelected ? 'bg-[#D4AF37] rounded-full' : ''
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        isSelected
                          ? 'text-white'
                          : isCurrentMonth
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Done Button */}
            <Pressable
              onPress={handleDone}
              className="bg-[#D4AF37] rounded-xl py-4 items-center"
            >
              <Text className="text-base font-bold text-black">Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
