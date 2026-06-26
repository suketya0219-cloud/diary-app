// ─── 写真サービス ─────────────────────────────────────────────────────────────
//
// TODO: インストールが必要
//   npx expo install expo-image-picker expo-camera
//
// 仕様書: インプット情報設計 > カメラ3軸
//   1. カメラロール（ユーザーが意図的に撮った写真）  → expo-image-picker
//   2. アプリ内手動撮影（その場で記録）             → expo-camera
//   3. 外部カメラ（定期自動撮影・行動把握）          → WiFi接続IPカメラ（実装予定）
//
// インストール後にコメントアウトを外すだけで動く。

// import * as ImagePicker from 'expo-image-picker';

export interface PhotoResult {
  uri: string;
  takenAt: string; // ISO8601
  source: 'camera_roll' | 'in_app_camera';
}

export const PhotoService = {
  // カメラロールから今日撮影した写真を取得する
  async getTodayPhotos(): Promise<PhotoResult[]> {
    // TODO: expo-image-picker導入後に差し替える
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') return [];
    //
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    //
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ['images'],
    //   allowsMultipleSelection: true,
    //   quality: 0.5,
    // });
    //
    // if (result.canceled) return [];
    // return result.assets.map(a => ({
    //   uri: a.uri,
    //   takenAt: a.exif?.DateTimeOriginal ?? new Date().toISOString(),
    //   source: 'camera_roll' as const,
    // }));

    console.log('[PhotoService] getTodayPhotos: 未実装（expo-image-picker未導入）');
    return PHOTO_MOCK;
  },

  // アプリ内でカメラを起動して撮影する
  async takePhoto(): Promise<PhotoResult | null> {
    // TODO: expo-camera導入後に差し替える
    // const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // if (status !== 'granted') return null;
    //
    // const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    // if (result.canceled) return null;
    // const asset = result.assets[0];
    // return {
    //   uri: asset.uri,
    //   takenAt: new Date().toISOString(),
    //   source: 'in_app_camera',
    // };

    console.log('[PhotoService] takePhoto: 未実装（expo-camera未導入）');
    return null;
  },
};

// ── モックデータ（実装前の動作確認用）────────────────────────────────────────
const PHOTO_MOCK: PhotoResult[] = [
  {
    uri: 'https://placehold.co/400x300/png',
    takenAt: new Date().toISOString(),
    source: 'camera_roll',
  },
];
