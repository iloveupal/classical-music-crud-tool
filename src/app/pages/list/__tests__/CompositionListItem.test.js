import React from "react";

import CompositionListItem from "../CompositionListItem";

import { shallow } from "enzyme";

const testComposition = {
  _id: "123",
  title: "Symphony",
  composer: "Beethoven",
  movements: [
    {
      _id: "245",
      title: "First",
      key: "c_s_m",
      recordings: [
        {
          _id: "456"
        }
      ]
    }
  ]
};

describe("CompositionListItem", () => {
  it("should match the snapshot", () => {
    const wrapper = shallow(
      <CompositionListItem
        data={testComposition}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
