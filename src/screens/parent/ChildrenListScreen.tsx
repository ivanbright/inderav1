import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { mockChildren } from '../../data/mockData';
import ChildCard from '../../components/ChildCard';
import ScreenHeader from '../../components/ScreenHeader';

export default function ChildrenListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Your Children"
        subtitle={`${mockChildren.length} children enrolled`}
        showBack={navigation?.canGoBack ? navigation.canGoBack() : false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockChildren.map(child => (
          <ChildCard
            key={child.id}
            name={child.name}
            grade={child.grade}
            avatar={child.avatar}
            overallAverage={child.overallAverage}
            attendanceRate={child.attendanceRate}
            variant="vertical"
            onPress={() => navigation.navigate('ChildOverview', { childId: child.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
});
