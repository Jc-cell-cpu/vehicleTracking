import { Camera, CameraView } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const fields = [
  'Number Plate',
  'Chassis Number',
  'Engine Number',
  'Front Image',
  'Back Image',
  'Full Vehicle Image',
];

export default function VehicleImageUpload() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [uploadedFields, setUploadedFields] = useState<Record<string, boolean>>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const cameraRef = useRef<CameraView>(null);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const openCamera = async (field: string) => {
    await requestPermission();
    setActiveField(field);
    setCameraOpen(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && activeField) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImages({ ...capturedImages, [activeField]: photo.uri });
      setCameraOpen(false);
      setActiveField(null);
    }
  };

  const deletePhoto = (field: string) => {
    const updated = { ...capturedImages };
    delete updated[field];
    const uploaded = { ...uploadedFields };
    delete uploaded[field];
    setCapturedImages(updated);
    setUploadedFields(uploaded);
  };

  const uploadAllImages = () => {
    const newUploads: Record<string, boolean> = {};
    fields.forEach(field => {
      if (capturedImages[field]) {
        newUploads[field] = true; // Simulate successful upload
      }
    });
    setUploadedFields(newUploads);
  };

  if (cameraOpen) {
    return (
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.captureContainer}>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
        </View>
      </CameraView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vehicle Image Upload</Text>
      {fields.map(field => (
        <View key={field} style={styles.fieldContainer}>
          <Text style={styles.label}>{field}</Text>

          {capturedImages[field] ? (
            <View style={styles.previewBox}>
              <TouchableOpacity onPress={() => { setPreviewImage(capturedImages[field]); setPreviewVisible(true); }}>
                <Image source={{ uri: capturedImages[field] }} style={styles.image} />
              </TouchableOpacity>

              {uploadedFields[field] ? (
                <Text style={styles.successText}>✓ Uploaded Successfully</Text>
              ) : (
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openCamera(field)} style={styles.button}>
                    <Text style={styles.buttonText}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePhoto(field)} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity onPress={() => openCamera(field)} style={styles.uploadButton}>
              <Text style={styles.buttonText}>Capture {field}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <ImageViewing
        images={[{ uri: previewImage }]}
        imageIndex={0}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      />

      <TouchableOpacity
        disabled={fields.some(field => !capturedImages[field])}
        style={[
          styles.uploadAllButton,
          fields.some(field => !capturedImages[field]) && styles.disabledButton
        ]}
        onPress={uploadAllImages}
      >
        <Text style={styles.buttonText}>
          {fields.some(field => !capturedImages[field]) ? 'Capture All Images First' : 'Upload All Images'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginTop: 35, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  fieldContainer: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  previewBox: { alignItems: 'center' },
  image: { width: 200, height: 200, borderRadius: 12 },
  actions: { flexDirection: 'row', marginTop: 10 },
  camera: { flex: 1 },
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  uploadAllButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
