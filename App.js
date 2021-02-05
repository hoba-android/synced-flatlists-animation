import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import env from "./config";

const { width, height } = Dimensions.get("screen");
const URL = env.pxexlURL;
const KEY = env.pexelAPIKey;
const IMAGE_SIZE = 80;
const SPACING = 10;

const fetchImagesFromPexel = async () => {
  const data = await fetch(URL, {
    headers: {
      Authorization: KEY,
    },
  });

  const { photos } = await data.json();
  return photos;
};

export default function App() {
  const [fetechedImages, setImages] = useState(null);
  const [activeindex, setAcitveIndex] = useState(0);

  useEffect(() => {
    const fetechImages = async () => {
      const images = await fetchImagesFromPexel();
      setImages(images);
    };

    fetechImages();
  }, []);

  const scrollToActiveIndex = (index) => {
    setAcitveIndex(index);
    topref?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbref?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbref?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  const thumbref = useRef();
  const topref = useRef();
  if (!fetechedImages) {
    console.log("no images ya 3asal");
    return <Text>No images ya 3asal</Text>;
  }
  return (
    <View style={styles.container}>
      <FlatList
        ref={topref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          console.log(ev.nativeEvent.contentOffset.x / width);
          console.log(Math.round(ev.nativeEvent.contentOffset.x / width));
          scrollToActiveIndex(
            Math.round(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        data={fetechedImages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                style={[StyleSheet.absoluteFillObject]}
                source={{ uri: item.src.portrait }}
              />
            </View>
          );
        }}
      />

      <FlatList
        ref={thumbref}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: IMAGE_SIZE }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        data={fetechedImages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: index === activeindex ? "#fff" : "transparent",
                }}
                source={{ uri: item.src.portrait }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
