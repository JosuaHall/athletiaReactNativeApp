import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, Dimensions, Animated } from "react-native";

const CustomCarousel = ({
  data,
  renderItem,
  onSnapToItem,
  sliderWidth,
  itemWidth,
  firstItem,
}) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(firstItem);
  const scrollX = new Animated.Value(firstItem * itemWidth);

  useEffect(() => {
    if (onSnapToItem) {
      scrollX.addListener(({ value }) => {
        const index = Math.round(value / itemWidth);
        if (index !== currentIndex) {
          setCurrentIndex(index);
          onSnapToItem(index);
        }
      });
    }

    return () => {
      scrollX.removeAllListeners();
    };
  }, [onSnapToItem, currentIndex, itemWidth, scrollX]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToOffsets={data.map((_, index) => index * itemWidth)}
      >
        {data.map((item, index) => (
          <View key={index} style={{ width: itemWidth }}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
      {onSnapToItem && (
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          {data.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                margin: 4,
                backgroundColor: index === currentIndex ? "blue" : "lightgray",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomCarousel;
