import { useTheme } from "@react-navigation/native";
import React, { Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// import any additional styles or dependencies you may need

const LeaderBoard = ({
  displayHeader,
  displayPrizes,
  data,
  displayDate,
  displayOrganizationHeader,
  displayTeamName,
  hideLeaderbaord,
}) => {
  const { colors } = useTheme();
  const currentUser = useSelector((state) => state.auth.user);

  const getFormattedDate = (date) => {
    const mongoDBDate = new Date(date);

    return `${mongoDBDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const getNumberBackgroundColor = (index) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "silver";
    if (index === 2) return "#CD7F32";
    return colors.card; // fallback to default card color for other numbers
  };

  const showAllUsersOfLeaderboard = () => {};

  // Find the index of the current user in the data.ranking array
  const currentUserIndex = data.ranking.findIndex(
    (user) => user.user._id === currentUser._id
  );

  return (
    <View style={{ alignItems: "center" }}>
      {/* Leaderboard */}
      <View style={{ ...styles.leaderboard, marginBottom: 20 }}>
        {displayHeader ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: colors.text,
                ...styles.heading,
                paddingBottom: 10,
              }}
            >
              Leaderboard
            </Text>
            <Ionicons
              size={20}
              name="ios-podium-outline"
              color={colors.text}
              style={{ paddingLeft: 10, paddingBottom: 10, marginTop: 20 }}
            />
          </View>
        ) : null}

        {displayOrganizationHeader ? (
          <View
            style={{ backgroundColor: colors.card, ...styles.organizationCard }}
          >
            {displayOrganizationHeader.logo ? (
              <Image
                style={styles.logo}
                source={{
                  uri: `${displayOrganizationHeader.logo}`,
                }}
              />
            ) : null}

            <View style={styles.headerLabel}>
              <Text style={{ color: colors.text, ...styles.orgName }}>
                {displayOrganizationHeader.name}
              </Text>
              {displayTeamName && (
                <Text style={{ color: colors.text, ...styles.teamName }}>
                  {displayTeamName}
                </Text>
              )}
            </View>
          </View>
        ) : null}

        {displayDate ? (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              paddingVertical: 20,
            }}
          >
            {data.startDate && data.endDate
              ? `${getFormattedDate(data.startDate)} - ${getFormattedDate(
                  data.endDate
                )}`
              : null}
          </Text>
        ) : null}

        {displayPrizes ? (
          <ScrollView
            style={{
              ...styles.listContainer,
              width: Dimensions.get("window").width,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                paddingBottom: 20,
                paddingTop: 10,
              }}
            >
              Offered Prizes
            </Text>
            {data.prizes.map((item, i) => (
              <View key={i} style={styles.itemContainer}>
                <View
                  style={[
                    styles.numberContainer,
                    {
                      backgroundColor: getNumberBackgroundColor(i),
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
        ) : null}

        {/* Table Header */}
        {hideLeaderbaord ? null : (
          <Fragment>
            {displayPrizes ? (
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                  paddingVertical: 10,
                  paddingTop: 20,
                }}
              >
                Leaderboard
              </Text>
            ) : null}
            <View style={styles.tableRow}>
              <View style={styles.tableHeader1}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                  }}
                >
                  Place
                </Text>
              </View>
              <View style={styles.tableHeader2}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>
                  User
                </Text>
              </View>
              <View style={styles.tableHeader3}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>
                  Points
                </Text>
              </View>
            </View>

            {/* Table Row */}
            {data.ranking?.length === 0 ? (
              <Text
                style={{
                  color: "grey",
                  textAlign: "center",
                  paddingHorizontal: 30,
                }}
              >
                Currently, there are no users who have earned any points!
              </Text>
            ) : (
              <Fragment>
                {data.ranking
                  .slice(0, currentUserIndex >= 5 ? 4 : 5)
                  .map((user, index) => (
                    <View
                      onPress={showAllUsersOfLeaderboard}
                      key={index}
                      style={styles.tableRow}
                    >
                      <View style={styles.tableColumn1}>
                        <View
                          style={{
                            ...styles.numberContainer,
                            backgroundColor: getNumberBackgroundColor(index),
                          }}
                        >
                          <Text
                            style={{
                              ...styles.itemNumber,
                              color:
                                index === 0 || index === 1 || index == 2
                                  ? "black"
                                  : colors.text,
                            }}
                          >
                            {`${index + 1}.`}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          ...styles.tableColumn2,
                          backgroundColor: colors.card,
                          borderWidth:
                            user.user._id === currentUser._id ? 2 : 0,
                          borderColor:
                            user.user._id === currentUser._id
                              ? "#007AFF"
                              : "transparent",
                          borderRightColor: "transparent",
                        }}
                      >
                        {user.user.profileImg ? (
                          <Image
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              borderWidth: 1,
                              borderColor: "transparent",
                              marginRight: 10,
                            }}
                            source={{
                              uri: `${user.user.profileImg}`,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              borderWidth: 1,
                              borderColor: "#eee",
                              marginRight: 10,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons
                              name="ios-person"
                              size={24}
                              color={colors.text}
                            />
                          </View>
                        )}
                        <View>
                          <Text
                            style={{ color: colors.text }}
                          >{`@${user.user.name}`}</Text>
                          <Text
                            style={{ color: colors.text }}
                          >{`${user.user.firstName} ${user.user.lastName}`}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          ...styles.tableColumn3,
                          backgroundColor: colors.card,
                          borderWidth:
                            user.user._id === currentUser._id ? 2 : 0,
                          borderColor:
                            user.user._id === currentUser._id
                              ? "#007AFF"
                              : "transparent",
                          borderLeftColor: "transparent",
                        }}
                      >
                        <Text style={{ color: colors.text }}>
                          {user.points}
                        </Text>
                      </View>
                    </View>
                  ))}
                {currentUserIndex >= 5 ? (
                  <View
                    onPress={showAllUsersOfLeaderboard}
                    style={styles.tableRow}
                  >
                    <View style={styles.tableColumn1}>
                      <View
                        style={{
                          ...styles.numberContainer,
                          backgroundColor:
                            getNumberBackgroundColor(currentUserIndex),
                        }}
                      >
                        <Text
                          style={{
                            ...styles.itemNumber,
                            color: colors.text,
                          }}
                        >
                          {`${currentUserIndex + 1}.`}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.tableColumn2,
                        backgroundColor: colors.card,
                        borderWidth:
                          data.ranking[currentUserIndex].user._id ===
                          currentUser._id
                            ? 2
                            : 0,
                        borderColor:
                          data.ranking[currentUserIndex].user._id ===
                          currentUser._id
                            ? "#007AFF"
                            : "transparent",
                        borderRightColor: "transparent",
                      }}
                    >
                      {data.ranking[currentUserIndex].user.profileImg ? (
                        <Image
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: "transparent",
                            marginRight: 10,
                          }}
                          source={{
                            uri: `${data.ranking[currentUserIndex].user.profileImg}`,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: "#eee",
                            marginRight: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="ios-person"
                            size={24}
                            color={colors.text}
                          />
                        </View>
                      )}
                      <View>
                        <Text
                          style={{ color: colors.text }}
                        >{`@${data.ranking[currentUserIndex].user.name}`}</Text>
                        <Text
                          style={{ color: colors.text }}
                        >{`${data.ranking[currentUserIndex].user.firstName} ${data.ranking[currentUserIndex].user.lastName}`}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.tableColumn3,
                        backgroundColor: colors.card,
                        borderWidth:
                          data.ranking[currentUserIndex].user._id ===
                          currentUser._id
                            ? 2
                            : 0,
                        borderColor:
                          data.ranking[currentUserIndex].user._id ===
                          currentUser._id
                            ? "#007AFF"
                            : "transparent",
                        borderLeftColor: "transparent",
                      }}
                    >
                      <Text style={{ color: colors.text }}>
                        {data.ranking[currentUserIndex].points}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Fragment>
            )}
          </Fragment>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  leaderboard: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  tableHeader1: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    left: 5,
  },
  tableHeader2: {
    flex: 3,
    alignItems: "flex-start",
    left: 30,
    marginBottom: 10,
  },
  tableHeader3: { flex: 1, alignItems: "center", marginBottom: 10 },
  tableColumn1: { flex: 0.8, alignItems: "center" },
  tableColumn2: {
    flexDirection: "row",
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    height: 50,
  },
  tableColumn3: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 50,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
  },
  organizationCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
    height: 100,
    marginVertical: 10,
    padding: 10,
  },
  headerLabel: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 15,
    resizeMode: "contain",
  },
  orgName: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  teamName: {
    justifySelf: "center",
    textAlign: "left",
    fontSize: 17,
    paddingHorizontal: 10,
  },
});

export default LeaderBoard;
