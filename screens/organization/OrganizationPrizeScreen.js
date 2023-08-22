import React, { useState, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import Colors from "./../../config/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import AddButton from "./../../components/AddButton";
import YearPicker from "../../components/YearPicker";
import LeaderBoard from "./../../components/teamManagement/LeaderBoard";
import CreateButton from "./../../components/CreateButton";
import { useDispatch, useSelector } from "react-redux";
import {
  createLeaderboard,
  deleteLeaderboard,
} from "../../actions/organizationActions";
import DeleteButton from "../../components/DeleteButton";

const OrganizationPrizeScreen = (navigation) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState(null);
  const [prizeItem, setPrizeItem] = useState("");
  const [prizeList, setPrizeList] = useState([]);
  const now = new Date();
  const year = now.getFullYear();
  // First day of the year
  const firstDay = new Date(year, 0, 1);
  const orgid = useSelector(
    (state) => state.organization.organization_list[0]._id
  );
  const hasLeaderboard = useSelector(
    (state) => state.organization.orgLeaderboard
  );

  // Last day of the year
  const lastDay = new Date(year, 11, 31);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const handleAddItem = () => {
    if (prizeItem.trim() !== "") {
      setPrizeList((prevList) => [...prevList, prizeItem]);
      setPrizeItem("");
    }
  };

  const handleDeleteItem = (index) => {
    setPrizeList((prevList) => prevList.filter((item, i) => i !== index));
  };

  const getNumberBackgroundColor = (index) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "silver";
    if (index === 2) return "#CD7F32";
    return colors.card; // fallback to default card color for other numbers
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const setFanPrizes = () => {
    if (startDate && endDate && prizeList.length !== 0) {
      setMsg(null);
      const data = { orgid, startDate, endDate, prizeList };
      dispatch(createLeaderboard(data));
    } else {
      setMsg("You must add prizes to the list");
    }
  };

  const getFormattedDate = (date) => {
    const mongoDBDate = new Date(date);

    return `${mongoDBDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteLeaderboard = (id) => {
    handleCloseModal();
    dispatch(deleteLeaderboard(id));
    setPrizeList([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {hasLeaderboard ? (
          <Fragment>
            <Text
              style={{ color: colors.text, ...styles.heading, marginTop: 20 }}
            >
              Current Competition
            </Text>

            {/* Prize Timeframe */}
            <View
              style={{
                backgroundColor: colors.card,
                paddingBottom: 20,
                paddingTop: 5,
                flexDirection: "row",
                width: Dimensions.get("window").width - 20,
                borderRadius: 10,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.text,
                    ...styles.heading,
                    marginTop: 10,
                  }}
                >
                  Start Date
                </Text>
                <Text style={{ color: colors.text }}>
                  {getFormattedDate(hasLeaderboard.startDate)}
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.text,
                    ...styles.heading,
                    marginTop: 10,
                  }}
                >
                  End Date
                </Text>

                <Text style={{ color: colors.text }}>
                  {getFormattedDate(hasLeaderboard.endDate)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  ...styles.heading,
                  marginTop: 40,
                  paddingBottom: 10,
                }}
              >
                Prizes
              </Text>
              <Ionicons
                size={20}
                name="ios-medal-outline"
                color={colors.text}
                style={{ paddingLeft: 10, paddingBottom: 10 }}
              />
            </View>

            <ScrollView
              style={{
                ...styles.listContainer,
                width: Dimensions.get("window").width,
              }}
            >
              {hasLeaderboard.prizes.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View
                    style={[
                      styles.numberContainer,
                      {
                        backgroundColor: getNumberBackgroundColor(index),
                      },
                    ]}
                  >
                    <Text style={{ color: colors.text, ...styles.itemNumber }}>
                      {item.place}.
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.itemNameContainer,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Text style={{ color: colors.text, ...styles.itemName }}>
                      {item.item}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <LeaderBoard
              displayDate={false}
              displayHeader={true}
              data={hasLeaderboard}
              navigation={navigation}
            ></LeaderBoard>
          </Fragment>
        ) : (
          <Fragment>
            <Text
              style={{ color: colors.text, ...styles.heading, marginTop: 20 }}
            >
              New Competition
            </Text>
            <Text
              style={{ color: colors.text, ...styles.heading, marginTop: 20 }}
            >
              Add Prizes
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{
                  color: colors.text,
                  backgroundColor: colors.card,
                  ...styles.input,
                }}
                placeholder="Enter prize item.."
                placeholderTextColor={Colors.placeholder}
                value={prizeItem}
                onChangeText={setPrizeItem}
              />
              <AddButton onPress={handleAddItem} />
            </View>
            <ScrollView style={styles.listContainer}>
              {prizeList.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View
                    style={[
                      styles.numberContainer,
                      {
                        backgroundColor: getNumberBackgroundColor(index),
                      },
                    ]}
                  >
                    <Text style={{ color: colors.text, ...styles.itemNumber }}>
                      {index + 1}.
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.itemNameContainer,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Text style={{ color: colors.text, ...styles.itemName }}>
                      {item}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Timeframe of Competiotion */}

            <Text
              style={{ color: colors.text, ...styles.heading, marginTop: 20 }}
            >
              Start Date
            </Text>
            <YearPicker
              onDateTimeSelected={handleStartDateChange}
              defaultDate={startDate}
            ></YearPicker>

            <Text
              style={{ color: colors.text, ...styles.heading, marginTop: 20 }}
            >
              End Date
            </Text>
            <YearPicker
              onDateTimeSelected={handleEndDateChange}
              defaultDate={endDate}
            ></YearPicker>
          </Fragment>
        )}

        {msg && (
          <View
            style={{
              flex: 1,
              backgroundColor: "orange",
              width: Dimensions.get("window").width - 20,
              borderRadius: 10,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ color: colors.text }}>{msg}</Text>
          </View>
        )}
        {hasLeaderboard ? (
          <Fragment>
            <DeleteButton
              onPress={() => handleOpenModal()}
              label={"End Competition"}
              styling={{ width: Dimensions.get("window").width - 20 }}
            ></DeleteButton>

            <Modal visible={showModal} animationType="slide" transparent={true}>
              <View
                style={{
                  flex: 1,

                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 30,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Are you sure you want to end this Competition?
                  </Text>
                  <Text style={{ textAlign: "center", marginTop: 10 }}>
                    Your leaderboard will be deleted! Organizations can only
                    have one competition setup at a time.
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#7F0000",
                        padding: 20,
                        margin: 5,
                        borderRadius: 20,
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleDeleteLeaderboard(hasLeaderboard._id)
                      }
                    >
                      <Text style={{ color: "white" }}>End</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "grey",
                        padding: 20,
                        margin: 5,
                        borderRadius: 20,
                        alignItems: "center",
                      }}
                      onPress={handleCloseModal}
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </Fragment>
        ) : (
          <CreateButton
            onPress={setFanPrizes}
            label={"Start Competition"}
            styling={{ width: Dimensions.get("window").width - 20 }}
          ></CreateButton>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    height: 400,
    width: Dimensions.get("window").width - 40,
    padding: 40,
    borderRadius: 20,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: Dimensions.get("window").width - 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  listContainer: {
    flex: 1,
    width: Dimensions.get("window").width - 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemNumber: {
    color: "black",
    fontSize: 16,
  },
  itemNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 50,
  },
  itemName: {
    flex: 1,
    marginLeft: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
});

export default OrganizationPrizeScreen;
