// SocialHeader.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Assuming Ionicons is used

const SocialHeader = React.memo(
  ({
    item,
    isGoing,
    attendingNumber,
    user,
    handleShowPeopleGoing,
    colors,
    styles,
    userid,
    mongoDBDate,
  }) => {
    const isDateOlderBy4Hours = (date) => {
      const currentDate = new Date();
      const timeDifference = currentDate - date; // Calculate the time difference in milliseconds
      const fourHoursInMilliseconds = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

      // Compare the time difference with 4 hours
      return timeDifference > fourHoursInMilliseconds;
    };
    return (
      <View style={styles.socialHeader}>
        {item.people_attending?.length === 0 ? (
          <Text
            style={{
              color: colors.text,
              ...styles.attendingDescriptionForNoOneAttending,
            }}
          >
            {isDateOlderBy4Hours(mongoDBDate) ? "" : "attending this event?"}
          </Text>
        ) : (
          <Text style={{ color: colors.text, ...styles.attendingDescription }}>
            {isGoing && attendingNumber === 0 ? (
              <Text
                style={{ color: colors.text, ...styles.attendingDescription }}
              >
                {isDateOlderBy4Hours(mongoDBDate)
                  ? "You attended this event"
                  : "You are attending this event:"}
              </Text>
            ) : isGoing && attendingNumber >= 1 ? (
              <Text
                style={{ color: colors.text, ...styles.attendingDescription }}
              >
                {isDateOlderBy4Hours(mongoDBDate)
                  ? `You & ${attendingNumber} others attended this event`
                  : `You & ${attendingNumber} others are attending this event:`}
              </Text>
            ) : !isGoing && attendingNumber >= 1 ? (
              <Text
                style={{ color: colors.text, ...styles.attendingDescription }}
              >
                {isDateOlderBy4Hours(mongoDBDate)
                  ? `${attendingNumber} others attended this event`
                  : `${attendingNumber} others are attending this event:`}
              </Text>
            ) : null}
          </Text>
        )}

        <TouchableOpacity
          onPress={(e) => handleShowPeopleGoing(e, item.people_attending)}
          style={styles.userContainer}
        >
          {item.people_attending.length !== 0 ? (
            <>
              {isGoing ? (
                <View key={user._id}>
                  {user.profileImg !== "" && !user.isPrivate ? (
                    <Image
                      style={{ ...styles.profileImg, marginRight: -25 }}
                      source={{
                        uri: `${user.profileImg}`,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        color: colors.text,
                        ...styles.borderNoProfileImg,
                        borderColor: "#CCE8DB",
                        backgroundColor: colors.background,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: -25,
                      }}
                    >
                      <Ionicons
                        name="ios-person"
                        size={30}
                        color={colors.text}
                      />
                    </View>
                  )}
                </View>
              ) : (
                ""
              )}
              {item.people_attending
                .slice(0, isGoing ? 5 : 6)
                .filter((user) => user._id !== userid)
                .map((user, index) => (
                  <View key={user._id}>
                    {user.profileImg !== "" && !user.isPrivate ? (
                      <Image
                        style={{
                          ...styles.profileImg,
                          borderColor: "#FF9AA2",
                          zIndex: index,
                          marginRight: -25,
                        }}
                        source={{
                          uri: `${user.profileImg}`,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          color: colors.text,
                          ...styles.borderStranger,
                          borderColor: "#FF9AA2",
                          backgroundColor: colors.background,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: -25,
                        }}
                      >
                        <Ionicons
                          name="ios-person"
                          size={30}
                          color={colors.text}
                        />
                      </View>
                    )}
                  </View>
                ))}
            </>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
);

export default SocialHeader;
