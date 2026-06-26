// ─── 位置情報サービス ─────────────────────────────────────────────────────────
//
// TODO: インストールが必要
//   npx expo install expo-location
//
// 仕様:
//   - 今日の滞在場所（自宅・職場・カフェ等）を把握して日記に反映する
//   - バックグラウンド位置情報はiOS制限あり（常時取得は許可が必要）
//   - まずはフォアグラウンド時のみ取得するシンプル実装から始める
//
// インストール後にコメントアウトを外すだけで動く。

// import * as Location from 'expo-location';

export interface LocationSnapshot {
  latitude: number;
  longitude: number;
  placeName: string; // 逆ジオコーディングで取得した地名
  recordedAt: string; // ISO8601
}

export const LocationService = {
  // 現在地を1回取得する
  async getCurrentLocation(): Promise<LocationSnapshot | null> {
    // TODO: expo-location導入後に差し替える
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') return null;
    //
    // const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    // const [place] = await Location.reverseGeocodeAsync({
    //   latitude: loc.coords.latitude,
    //   longitude: loc.coords.longitude,
    // });
    //
    // const placeName = [place.city, place.district, place.name]
    //   .filter(Boolean)
    //   .join(' ');
    //
    // return {
    //   latitude: loc.coords.latitude,
    //   longitude: loc.coords.longitude,
    //   placeName,
    //   recordedAt: new Date().toISOString(),
    // };

    console.log('[LocationService] getCurrentLocation: 未実装（expo-location未導入）');
    return LOCATION_MOCK;
  },

  // 今日の滞在履歴を取得する（将来: バックグラウンド記録から集計）
  async getTodayLocations(): Promise<LocationSnapshot[]> {
    // TODO: バックグラウンド位置記録の実装後に差し替える
    console.log('[LocationService] getTodayLocations: 未実装');
    return [LOCATION_MOCK];
  },
};

// ── モックデータ（実装前の動作確認用）────────────────────────────────────────
const LOCATION_MOCK: LocationSnapshot = {
  latitude: 35.6762,
  longitude: 139.6503,
  placeName: '渋谷区（モック）',
  recordedAt: new Date().toISOString(),
};
