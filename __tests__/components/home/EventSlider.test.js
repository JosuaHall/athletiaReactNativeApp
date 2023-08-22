import React from "react";
import renderer from "react-test-renderer";

import EventSlider from "../../../components/home/EventSlider";

describe("<EventSlider />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<EventSlider />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
