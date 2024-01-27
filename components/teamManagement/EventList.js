import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getEventList } from "./../../actions/eventActions";
import LoadingSpinnerStackScreen from "./../../screens/LoadingSpinnerStackScreen";

const EventList = ({ navigation, onPress }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const { _id } = useSelector((state) => state.team.selected_team);
  const orgid = useSelector((state) => state.organization.selected._id);
  const eventCreated = useSelector((state) => state.event.isCreated);
  const eventDeleted = useSelector((state) => state.event.isDeleted);
  const eventUpdated = useSelector((state) => state.event.isUpdated);
  const eventList = useSelector((state) => state.event.event_list);
  const isLoading = useSelector((state) => state.event.isLoadingEvents);
  const isSelectedOrgLoading = useSelector((state) => state.event.orgIsLoading);

  useEffect(() => {
    dispatch(getEventList(orgid, _id));
  }, []);

  useEffect(() => {
    if (eventCreated || eventDeleted || eventUpdated) {
      dispatch(getEventList(orgid, _id));
    }
  }, [eventCreated, eventDeleted, eventUpdated]); //or update,deleted

  useEffect(() => {
    setEvents(eventList);
  }, [eventList]);

  /*
  useEffect(() => {
    if (eventList !== undefined) {
      const team = eventList.filter((team) => team._id === _id);
      setEvents(team[0].events);
    }
  }, [eventList]);*/

  const handleEventPress = (e, event) => {
    onPress(event);
  };

  const getFormattedDate = (date) => {
    const mongoDBDate = new Date(date);
    return `${mongoDBDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}  @ ${mongoDBDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  };

  // Determine the index of the next closest event
  const now = new Date();
  const nextEventIndex = events
    ? events.findIndex((event) => new Date(event.date_time) > now)
    : null;

  return (
    <View style={styles.container}>
      {!isSelectedOrgLoading && !isLoading && events && eventList ? (
        events.length !== 0 ? (
          events.map((event, index) => (
            <View key={event._id}>
              {nextEventIndex && index === nextEventIndex ? (
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 5,
                    paddingBottom: 5,
                    borderBottomWidth: 3,
                    borderBottomColor: "red",
                    marginHorizontal: 50,
                  }}
                >
                  <Text style={{ color: colors.text, textAlign: "center" }}>
                    Upcoming Events
                  </Text>
                </View>
              ) : null}
              <TouchableOpacity onPress={(e) => handleEventPress(e, event)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.cardContainer,
                    borderColor:
                      event.home_away === "Home" ? "#59db56" : "#ff9966",
                  }}
                >
                  <View style={styles.dateTimeContainer}>
                    <Text
                      style={{
                        color: colors.text,
                        ...styles.date,
                      }}
                    >
                      {new Date(event.date_time).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>

                    <Text
                      style={{
                        color: colors.text,
                        ...styles.time,
                      }}
                    >
                      {`${new Date(event.date_time).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}`}
                    </Text>

                    <Text
                      style={{
                        color: colors.text,

                        ...styles.date,
                      }}
                    >
                      {
                        new Date(event.date_time)
                          .toLocaleTimeString("en-US", {
                            timeZoneName: "short",
                          })
                          .split(" ")[2]
                      }
                    </Text>
                  </View>

                  <View style={{ flex: 0.2 }}>
                    <Text
                      style={{
                        color:
                          event.home_away === "Home" ? "#59db56" : "#ff9966",
                      }}
                    >
                      {event.home_away === "Home" ? "vs" : "@"}
                    </Text>
                  </View>

                  <View style={styles.eventLogoContainer}>
                    <Image
                      style={styles.eventLogo}
                      source={{
                        uri: `${event.opponent.logo}`,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      ...styles.opponent,
                    }}
                  >
                    {event.opponent.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ color: colors.text, ...styles.opponent }}>
            This team has currently no Events
          </Text>
        )
      ) : (
        <View
          style={{
            paddingBottom: 50,
          }}
        >
          <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    overflow: "hidden",
    width: Dimensions.get("window").width - 20,
  },
  date: {
    flex: 1,
    textAlign: "left",
  },
  eventLogoContainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  eventLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  opponent: {
    flex: 2.2,
    paddingVertical: 5,
    paddingHorizontal: 0,
    textAlign: "left",
    flexWrap: "wrap",
  },
  time: {
    flex: 1,
    paddingHorizontal: 0,
    textAlign: "left",
  },
  dateTimeContainer: {
    alignItems: "flex-start",
    justifyContent: "space-around",

    padding: 10,
    flex: 1.1,
  },
});

export default EventList;
