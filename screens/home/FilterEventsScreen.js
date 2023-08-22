// FilterEventsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CreateButton from "./../../components/CreateButton";
import DropdownList from "./../../components/DrodownList";
import { useDispatch, useSelector } from "react-redux";
import { getSports } from "../../actions/teamActions";
import SportList from "./../../components/home/SportList";
import YearPicker from "./../../components/YearPicker";
import { setEventFilter } from "../../actions/eventActions";

const FilterEventsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const now = new Date();
  const year = now.getFullYear();
  // First day of the year
  const firstDay = new Date(year, 0, 1);

  // Last day of the year
  const lastDay = new Date(year, 11, 31);

  const currentFilter = useSelector((state) => state.event.filter);
  const [homeAway, setHomeAway] = useState(
    currentFilter ? currentFilter.homeAway : "Home & Away"
  );
  const sports = useSelector((state) => state.team.all_sports);
  //useState for all FilterOptions
  const [selectedSports, setSelectedSports] = useState(
    currentFilter ? currentFilter.teams : []
  );
  const [startDate, setStartDate] = useState(
    currentFilter ? currentFilter.startDate : firstDay
  );
  const [endDate, setEndDate] = useState(
    currentFilter ? currentFilter.endDate : lastDay
  );

  useEffect(() => {
    dispatch(getSports());
  }, []);

  const updateFilter = () => {
    //call action to set Filter
    const filter = {
      homeAway,
      teams: selectedSports,
      startDate,
      endDate,
    };

    dispatch(setEventFilter(filter));
    navigation.navigate("Events");
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSelectSport = (sport) => {
    if (!selectedSports.includes(sport)) {
      setSelectedSports((prevSelectedSports) => [...prevSelectedSports, sport]);
    }
  };

  const handleDropdownSelect = (value) => {
    setHomeAway(value);
  };

  const deleteTeam = (sport, e) => {
    setSelectedSports((prevSelectedSports) =>
      prevSelectedSports.filter((sport1) => sport1 !== sport)
    );
  };

  const dropdownOptions = ["Home", "Away", "Home & Away"];

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text, ...styles.header }}>Show only</Text>
      <View style={styles.homeAwayContainer}>
        <DropdownList
          options={dropdownOptions}
          onSelect={handleDropdownSelect}
          selectedValue={homeAway}
        />
      </View>
      <Text style={{ color: colors.text, ...styles.header }}>Start Date</Text>

      <YearPicker
        onDateTimeSelected={handleStartDateChange}
        defaultDate={startDate}
      ></YearPicker>
      <Text style={{ color: colors.text, ...styles.header }}>End Date</Text>
      <YearPicker
        onDateTimeSelected={handleEndDateChange}
        defaultDate={endDate}
      ></YearPicker>

      <Text style={{ color: colors.text, ...styles.header }}>Sports</Text>
      <SportList allSports={sports} onSelection={handleSelectSport}></SportList>
      <View style={{ flex: 1 }}>
        <FlatList
          data={selectedSports}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View key={item}>
              <View
                style={{
                  backgroundColor: colors.card,
                  ...styles.cardContainer,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    ...styles.adminUsername,
                  }}
                >
                  {item}
                </Text>
                <TouchableOpacity onPress={(e) => deleteTeam(item, e)}>
                  <Text
                    style={{
                      color: "white",
                      ...styles.deleteButton,
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <CreateButton label={"Update"} onPress={updateFilter}></CreateButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 5,
    zIndex: 200,
  },
  headerDate: {
    fontSize: 15,
    paddingTop: 0,
    paddingBottom: 5,
    textAlign: "center",
  },
  homeAwayContainer: {
    alignItems: "center",
    flexDirection: "row",
    zIndex: 400,
  },
  homeAway: {
    flex: 1,
    alignItems: "center",
  },
  datesContainer: {
    zIndex: 300,
    flex: 1,
    alignItems: "center",
  },
  checkbox: {
    margin: 10,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "grey",
  },
  sportCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 60,
    marginVertical: 5,
    padding: 10,
  },
  sportName: {
    flex: 2,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
    marginHorizontal: "auto",
    width: Dimensions.get("window").width - 60,
  },
  adminUsername: {
    flex: 2,
    padding: 20,
  },
  deleteButton: {
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#7F0000",
  },
});

export default FilterEventsScreen;
