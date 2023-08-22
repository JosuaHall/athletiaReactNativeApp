import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import EventCardNoSocial from "./EventCardNoSocial";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const EventSliderNoSocial = ({ navigation }) => {
  const { colors } = useTheme();
  const all_teams = useSelector((state) => state.organization.foundOrg.teams);
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderWidth = Dimensions.get("window").width;
  const itemWidth = sliderWidth - 100;

  useEffect(() => {
    if (all_teams.length !== 0) {
      const all_events = []
        .concat(
          ...all_teams.map((team) =>
            team.events.map((event) => ({
              ...event,
              sport: team.sport,
              key: event._id,
            }))
          )
        )
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
      //all events sorted by date
      setData(all_events);
      const currentDate = new Date();
      const index = all_events.findIndex(
        (event) => new Date(event.date_time) >= currentDate
      );
      const lastElementIndex = all_events.length - 1; // Index of the last element in the array
      const activeIndex = index >= 0 ? index : lastElementIndex;
      setActiveIndex(activeIndex);
    }
  }, []);

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 200,
          }}
        >
          <Ionicons
            name="ios-calendar"
            size={25}
            color={colors.text}
            style={{ paddingBottom: 10 }}
          />
          <Text style={{ color: colors.text, flexGrow: 1 }}>
            This team has currently no Events
          </Text>
        </View>
      ) : (
        <Carousel
          data={data}
          renderItem={({ item, index }) => (
            <EventCardNoSocial key={index} item={item}></EventCardNoSocial>
          )}
          onSnapToItem={(index) => setActiveIndex(index)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          firstItem={activeIndex}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default EventSliderNoSocial;
