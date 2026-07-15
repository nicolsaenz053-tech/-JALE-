import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductForm from '../components/ProductForm';

export default function HomeScreen() {
  const handleProductSubmit = (data: any) => {
    console.log('Product data submitted:', data);
    // Aquí enviarías los datos al backend
  };

  return (
    <View style={styles.container}>
      <ProductForm onSubmit={handleProductSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
