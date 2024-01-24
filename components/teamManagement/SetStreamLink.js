import React from "react";
import { View } from "react-native-web";
import InputField from "../InputField";

const SetStreamLink = () => {
  const [streamLink, setStreamLink] = useState("");

  const handleStreamLinkChange = (text) => {
    setStreamLink(text);
    // Do any additional logic you need with the input value
  };
  return (
    <View>
      <InputField
        placeholder="Enter https link: e.g. https://www.google.com"
        onInput={handleStreamLinkChange}
        value={streamLink}
        // Add any additional styles if needed
        secureTextEntry={false} // Set to true if it's a password input
      />
    </View>
  );
};

export default SetStreamLink;
