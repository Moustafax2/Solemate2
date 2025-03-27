import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CameraType } from 'expo-camera/build/Camera.types';

interface CameraComponentProps {
  onImageCaptured: (imageUri: string) => Promise<void>;
}

export default function CameraComponent({ onImageCaptured }: CameraComponentProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePicture({ quality: 0.7 });
      setCapturedImage(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleAnalyzeImage = async () => {
    if (capturedImage) {
      try {
        setIsAnalyzing(true);
        await onImageCaptured(capturedImage);
        // After analysis is complete, navigate to results
        router.push('/shoe-results');
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const flipCamera = () => {
    setType(type === 'back' ? 'front' : 'back');
  };

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.galleryButton} 
          onPress={pickImage}
        >
          <Text style={styles.galleryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setCapturedImage(null)}
              disabled={isAnalyzing}
            >
              <Ionicons name="refresh-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={handleAnalyzeImage}
              disabled={isAnalyzing}
            >
              <Ionicons name="checkmark-outline" size={24} color="white" />
              <Text style={styles.buttonText}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView 
          style={styles.camera} 
          facing={type} 
          ref={cameraRef}
          onCameraReady={() => console.log('Camera ready')}
          onMountError={(error) => console.error('Camera error:', error)}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <View style={styles.captureButton}>
                <View style={styles.captureButtonInner} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={flipCamera}>
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  button: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  permissionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  galleryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
  },
}); 