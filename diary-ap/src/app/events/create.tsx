import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_PLACES, MOCK_USERS, CURRENT_USER_ID } from '@/mock/events';

export default function EventCreateScreen() {
  const theme = useTheme();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [diaryEnabled, setDiaryEnabled] = useState(true);

  const otherUsers = MOCK_USERS.filter((u) => u.id !== CURRENT_USER_ID);
  const [selectedParticipant, setSelectedParticipant] = useState(otherUsers[0]?.id ?? '');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('入力エラー', 'タイトルを入力してください。');
      return;
    }
    Alert.alert('保存（モック）', `「${title}」を作成しました。\n共有フローはUIモックです。`, [
      { text: 'OK', onPress: () => router.push('/events' as any) },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.form}>

            {/* タイトル */}
            <View style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">予定タイトル</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
                value={title}
                onChangeText={setTitle}
                placeholder="例: 梅田で夕食"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* 日付・時刻 */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText type="small" themeColor="textSecondary">日付</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText type="small" themeColor="textSecondary">開始</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText type="small" themeColor="textSecondary">終了</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* 場所 */}
            <View style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">場所</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
                value={location}
                onChangeText={setLocation}
                placeholder="例: 梅田 茶屋町"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* 場所候補 */}
            <ThemedView type="backgroundElement" style={styles.placeCard}>
              <ThemedText type="smallBold">場所候補</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">（本番: Google Places API）</ThemedText>
              {MOCK_PLACES.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={[styles.placeButton, { borderColor: theme.backgroundSelected }]}
                  onPress={() => setLocation(place.name)}
                  activeOpacity={0.8}
                >
                  <ThemedText type="small">{place.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{place.address}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>

            {/* 参加者 */}
            <View style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">招待する人</ThemedText>
              <View style={styles.participantRow}>
                {otherUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.participantButton,
                      { backgroundColor: selectedParticipant === user.id ? theme.text : theme.backgroundElement },
                    ]}
                    onPress={() => setSelectedParticipant(user.id)}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      type="small"
                      style={selectedParticipant === user.id ? { color: theme.background } : undefined}
                    >
                      {user.displayName}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* メモ */}
            <View style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">メモ</ThemedText>
              <TextInput
                style={[styles.textarea, { color: theme.text, borderColor: theme.backgroundElement }]}
                value={description}
                onChangeText={setDescription}
                placeholder="詳細・メモなど"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* 日記反映トグル */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setDiaryEnabled((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggle, { backgroundColor: diaryEnabled ? '#34C759' : theme.backgroundElement }]}>
                <View style={[styles.toggleThumb, { transform: [{ translateX: diaryEnabled ? 20 : 2 }] }]} />
              </View>
              <ThemedText type="small">日記へ反映する</ThemedText>
            </TouchableOpacity>

            {/* ボタン */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.backgroundElement }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <ThemedText type="small">キャンセル</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.text }]}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <ThemedText type="small" style={{ color: theme.background, fontWeight: '600' }}>保存して共有へ</ThemedText>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  form: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    padding: Spacing.two,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    padding: Spacing.two,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  placeCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  placeButton: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    padding: Spacing.two,
    gap: 2,
  },
  participantRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  participantButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  saveButton: {
    flex: 2,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
});
