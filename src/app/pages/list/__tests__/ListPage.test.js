import { sleep } from "asyncbox";

import React from "react";

import { ListPage } from "..";
import List from "../List";
import ListSearchBar from "../ListSearchBar";

import { shallow } from "enzyme";

describe("ListPage", () => {
  it("should call onGetCompositions when it mounts", () => {
    const onGetCompositions = jest.fn();

    const wrapper = shallow(
      <ListPage
        onGetCompositions={onGetCompositions}
        onDeleteComposition={jest.fn()}
        onDisplayError={jest.fn()}
      />
    );

    return sleep(0).then(() => {
      expect(onGetCompositions).toHaveBeenCalledWith({
        search: null,
        offset: 0
      });
    });
  });

  it("should render compositions that are returned from the onGetCompositions method", () => {
    const returnedItems = [
      {
        _id: "123",
        title: "Symphony 1",
        composer: "Beethoven",
        movements: []
      },
      {
        _id: "234",
        title: "Symphony 2",
        composer: "Beethoven",
        movements: []
      },
      {
        _id: "345",
        title: "Symphony 3",
        composer: "Beethoven",
        movements: []
      }
    ];

    const onGetCompositions = jest.fn(() =>
      Promise.resolve({
        count: 3,
        success: true,
        errors: [],
        result: returnedItems
      })
    );

    const wrapper = shallow(
      <ListPage
        onGetCompositions={onGetCompositions}
        onDeleteComposition={jest.fn()}
        onDisplayError={jest.fn()}
      />
    );

    return sleep(0).then(() => {
      expect(
        wrapper
          .find(List)
          .at(0)
          .props().items
      ).toEqual(returnedItems);
    });
  });

  it("should call onDeleteComposition when List is calling this prop", () => {
    const onDelete = jest.fn(() =>
      Promise.resolve({ deleted: 1, ok: 1, errors: [] })
    );

    const wrapper = shallow(
      <ListPage
        onGetCompositions={jest.fn(() =>
          Promise.resolve({ count: 0, result: [], errors: [] })
        )}
        onDeleteComposition={onDelete}
        onDisplayError={jest.fn()}
      />
    );

    wrapper
      .find(List)
      .at(0)
      .props()
      .onDeleteItem("123");

    expect(onDelete).toHaveBeenCalledWith({ id: "123" });
  });

  it("should request again when the container scroll reaches bottom", () => {
    const returnedItems = [
      {
        _id: "123",
        title: "Symphony 1",
        composer: "Beethoven",
        movements: []
      },
      {
        _id: "234",
        title: "Symphony 2",
        composer: "Beethoven",
        movements: []
      },
      {
        _id: "345",
        title: "Symphony 3",
        composer: "Beethoven",
        movements: []
      }
    ];

    const onGetCompositions = jest.fn(() =>
      Promise.resolve({
        count: 10,
        success: true,
        errors: [],
        result: returnedItems
      })
    );

    const wrapper = shallow(
      <ListPage
        onGetCompositions={onGetCompositions}
        onDeleteComposition={jest.fn()}
        onDisplayError={jest.fn()}
      />
    );

    return sleep(100)
      .then(() => {
        wrapper
          .find("div")
          .at(0)
          .props()
          .onScroll({
            target: {
              scrollHeight: 500,
              scrollTop: 50,
              clientHeight: 450
            }
          });
        return sleep(100);
      })
      .then(() => {
        expect(onGetCompositions).toHaveBeenCalledTimes(2);
        expect(onGetCompositions).toHaveBeenNthCalledWith(1, {
          offset: 0,
          search: null
        });
        expect(onGetCompositions).toHaveBeenNthCalledWith(2, {
          offset: 3,
          search: null
        });
      });
  });

  it("should perform a request correctly when a child ListSearchBar requests a new search", () => {
    const onGetCompositions = jest.fn(() =>
      Promise.resolve({
        count: 0,
        success: true,
        errors: [],
        result: []
      })
    );

    const wrapper = shallow(
      <ListPage
        onGetCompositions={onGetCompositions}
        onDeleteComposition={jest.fn()}
        onDisplayError={jest.fn()}
      />
    );

    return sleep(0)
      .then(() => {
        wrapper
          .find(ListSearchBar)
          .at(0)
          .props()
          .onSearch("movement=second;year=1996;performer=john");
        return sleep(100);
      })
      .then(() => {
        expect(onGetCompositions).toHaveBeenCalledTimes(2);
        expect(onGetCompositions).toHaveBeenNthCalledWith(1, {
          offset: 0,
          search: null
        });
        expect(onGetCompositions).toHaveBeenNthCalledWith(2, {
          offset: 0,
          search: {
            movement: "second",
            year: "1996",
            performer: "john"
          }
        });
      });
  });
});
