//EventSlider.js
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  useTheme,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import CustomCarousel from "./CustomCarousel";
import EventCard from "./EventCard";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveEventIndex,
  setAttendingUsers,
} from "./../../actions/eventActions";
import {
  attendEvent,
  unattendEvent,
  getAllLeaderboardsOfOrganization,
  resetPointsUpdated,
} from "../../actions/organizationActions";
import { Ionicons } from "@expo/vector-icons";

const EventSlider = ({ organization, navigation, route, onShare }, ref) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const carouselRef = useRef(null);
  const eventFilter = useSelector((state) => state.event.filter);
  const user_id = useSelector((state) => state.auth.user._id);
  const org_id = useSelector((state) => state.organization.homeOrgRender._id);
  const teams = useSelector((state) => state.organization.homeOrgRender.teams);
  const isLoading = useSelector((state) => state.organization.orgIsLoading);
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 3);

  const sixMonthsForward = new Date(currentDate);
  sixMonthsForward.setMonth(currentDate.getMonth() + 6);
  const pointsUpdated = useSelector(
    (state) => state.organization.pointsUpdated
  );
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState();

  const sliderWidth = Dimensions.get("window").width;
  const itemWidth = sliderWidth - 100;

  const [allLeaderboards, setAllLeaderboards] = useState([]);
  const followedOrg = useSelector(
    (state) => state.auth.user.organizations_followed
  );
  const orgIds = followedOrg.map((org) => org._id);

  const user = useSelector((state) => state.auth.user);
  const leaderboards = useSelector(
    (state) => state.organization.allLeaderboards
  );
  const orgLeaderboard = useSelector(
    (state) => state.organization.orgLeaderboard
  );
  const teamLeaderboard = useSelector((state) => state.team.teamLeaderboard);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const handleLayoutReady = () => {
    // This function is called when the layout is ready
    setIsLayoutReady(true);

    // Set the initial item after the layout is ready
    if (carouselRef.current) {
      const currentDate = new Date();
      const all_events = data;
      const index = all_events.findIndex(
        (event) => new Date(event.date_time) >= currentDate
      );
      const lastElementIndex = all_events.length - 1;
      const idx = index >= 0 ? index : lastElementIndex;
      carouselRef.current.snapToItem(idx);
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToItem: () => {
      if (carouselRef.current) {
        const currentDate = new Date();
        const all_events = data;
        const index = all_events.findIndex(
          (event) => new Date(event.date_time) >= currentDate
        );
        const lastElementIndex = all_events.length - 1;
        const idx = index >= 0 ? index : lastElementIndex;
        carouselRef.current.snapToItem(idx);
      }
    },
  }));

  useEffect(() => {
    // currently not in use
    if (leaderboards) setAllLeaderboards(leaderboards);
  }, [leaderboards]);

  useEffect(() => {
    //dispatch(getAllLeaderboardsOfOrganization(orgIds));   currently not in use
    //dispatch(resetPointsUpdated());
  }, [, followedOrg, user, orgLeaderboard, teamLeaderboard, pointsUpdated]);

  // Set the initial data
  useEffect(() => {
    if (organization) {
      const processedEvents = processEvents(teams, eventFilter);
      setData(processedEvents.data);
      setActiveIndex(processedEvents.activeIndex);
      dispatch(setActiveEventIndex(processedEvents.activeIndex));
    }
  }, [teams, eventFilter, organization]);

  //get the events that need to be displayed
  const processEvents = (teams, eventFilter) => {
    if (teams && eventFilter) {
      const filteredTeams = teams.filter(
        (team) =>
          eventFilter.teams.length === 0 ||
          eventFilter.teams.includes(team.sport)
      );

      const all_events = []
        .concat(
          ...filteredTeams.map((team) =>
            team.events
              .filter(
                (event) =>
                  new Date(event.date_time) >= sixMonthsAgo &&
                  new Date(event.date_time) <= sixMonthsForward &&
                  (!eventFilter.homeAway ||
                    eventFilter.homeAway.includes(event.home_away))
              )
              .map((event) => ({
                ...event,
                sport: team.sport,
                key: event._id,
                teamid: team._id,
              }))
          )
        )
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

      const currentDate = new Date();
      const index = all_events.findIndex(
        (event) => new Date(event.date_time) >= currentDate
      );
      // Check if there are events in the future
      if (index >= 0) {
        // Get up to 3 past events or all events from activeIndex to the end
        const pastEvents = all_events.slice(0, index).slice(-3);

        return {
          data: pastEvents.concat(all_events.slice(index)),
          activeIndex: index,
        };
      } else {
        // All events are in the past, get up to 3 latest events
        const pastEvents = all_events.slice(-3);

        return {
          data: pastEvents,
          activeIndex: all_events.length - 1,
        };
      }
    } else if (teams) {
      const all_events = []
        .concat(
          ...teams.map((team) =>
            team.events
              .filter(
                (event) =>
                  new Date(event.date_time) >= sixMonthsAgo &&
                  new Date(event.date_time) <= sixMonthsForward
              )
              .map((event) => ({
                ...event,
                sport: team.sport,
                key: event._id,
                teamid: team._id,
              }))
          )
        )
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

      const currentDate = new Date();
      const index = all_events.findIndex(
        (event) => new Date(event.date_time) > currentDate
      );
      // Check if there are events in the future
      if (index >= 0) {
        // Get up to 3 past events or all events from activeIndex to the end
        const pastEvents = all_events.slice(0, index).slice(-3);

        return {
          data: pastEvents.concat(all_events.slice(index)),
          activeIndex: index,
        };
      } else {
        // All events are in the past, get up to 3 latest events
        const pastEvents = all_events.slice(-3);

        return {
          data: pastEvents,
          activeIndex: all_events.length - 1,
        };
      }
    }

    return { data: [], activeIndex: 0 };
  };

  const attendingEvent = (e, event) => {
    //action: attendEvent   orgid, teamid, eventid, userid
    //-> attendEvent updates event.people_attending && returns updated oranization Object
    //  -> useEffect in HomeScreen should take care of rerendering the updated object
    //     by setting the state of this object
    const orgid = org_id;
    const teamid = event.teamid;
    const eventid = event._id;
    const userid = user_id;

    dispatch(attendEvent(orgid, teamid, eventid, userid));
  };
  const unAttendingEvent = (e, event) => {
    //action: attendEvent   orgid, teamid, eventid, userid
    //-> attendEvent updates event.people_attending && returns updated oranization Object
    //  -> useEffect in HomeScreen should take care of rerendering the updated object
    //     by setting the state of this object
    const orgid = org_id;
    const teamid = event.teamid;
    const eventid = event._id;
    const userid = user_id;

    dispatch(unattendEvent(orgid, teamid, eventid, userid));
  };

  //show people going list of an event
  const showPeopleGoing = (event, people_attending) => {
    //action: set people_attending
    dispatch(setAttendingUsers(people_attending));
    navigation.navigate("PeopleGoing");
  };

  return (
    <ScrollView style={styles.container} onLayout={handleLayoutReady}>
      {teams ? (
        teams.length !== 0 && data && data.length !== 0 ? (
          <Carousel
            data={data} //all events
            ref={carouselRef}
            renderItem={({ item }) => (
              <EventCard
                onPress={(e, event) => attendingEvent(e, event)}
                onUnattendingPress={(e, event) => unAttendingEvent(e, event)}
                onShowPeopleGoing={(event, people_attending) =>
                  showPeopleGoing(event, people_attending)
                }
                onShare={onShare}
                item={item}
              ></EventCard>
            )}
            onSnapToItem={(index) => setActiveIndex(index)}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={isLayoutReady ? activeIndex : 0}
          />
        ) : (
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
        )
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default React.forwardRef(EventSlider);
