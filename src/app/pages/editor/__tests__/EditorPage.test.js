import React from "react";
import { shallow } from "enzyme";
import { sleep } from "asyncbox";

import {
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING,
  EDITOR_ENTITY_COMPOSITION
} from "app/pages/editor/EditorConstants";

import { EditorPage } from "..";
import EditorForm from "../forms/EditorForm";

const defaultProps = {
  onGetComposition: jest.fn(),
  onUpdateComposition: jest.fn(),
  onCreateComposition: jest.fn(),
  onCreateMovement: jest.fn(),
  onUpdateMovement: jest.fn(),
  onDeleteMovement: jest.fn(),
  onCreateRecording: jest.fn(),
  onUpdateRecording: jest.fn(),
  onDeleteRecording: jest.fn()
};

describe("EditorPage", () => {
  it("should request a composition with an id on load, if id is passed", () => {
    const onGetComposition = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: {
          _id: "abc",
          title: "bla",
          composer: "bla",
          movements: []
        }
      })
    );

    const wrapper = shallow(
      <EditorPage
        {...defaultProps}
        onGetComposition={onGetComposition}
        id={"abc"}
      />
    );

    return sleep(100).then(() => {
      expect(onGetComposition).toHaveBeenCalledWith({ id: "abc" });
    });
  });

  it("should create a new composition if id is not passed", () => {
    const onCreateComposition = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: "bla"
      })
    );

    const wrapper = shallow(
      <EditorPage {...defaultProps} onCreateComposition={onCreateComposition} />
    );

    return sleep(100).then(() => {
      expect(onCreateComposition).toHaveBeenCalledWith({});
    });
  });

  it("should update a composition and children correctly", () => {
    const onGetComposition = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: {
          _id: "abc",
          title: "bla",
          composer: "bla",
          movements: [
            {
              _id: "a1",
              title: "mov1",
              key: "c_s_m",
              recordings: [
                {
                  _id: "b1",
                  year: 1985,
                  performers: [
                    {
                      name: "guy",
                      type: "piano"
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    );

    const successfulUpdate = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: {
          ok: 1,
          updated: 1
        }
      })
    );

    const wrapper = shallow(
      <EditorPage
        {...defaultProps}
        onGetComposition={onGetComposition}
        onUpdateMovement={successfulUpdate}
        onUpdateRecording={successfulUpdate}
        onUpdateComposition={successfulUpdate}
        id={"abc"}
      />
    );

    return sleep(100)
      .then(() => {
        wrapper
          .find(EditorForm)
          .at(0)
          .props()
          .onChange({
            entity: EDITOR_ENTITY_MOVEMENT,
            data: {
              _id: "a1",
              title: "mov1",
              key: "c_s_m",
              recordings: [
                {
                  _id: "b1",
                  year: 1985,
                  performers: [
                    {
                      name: "guy",
                      type: "piano"
                    }
                  ]
                }
              ]
            },
            prop: "title",
            value: "mov2"
          });

        return sleep(100);
      })
      .then(() => {
        expect(successfulUpdate).toHaveBeenCalledWith({
          id: "a1",
          title: "mov2"
        });

        expect(
          wrapper
            .find(EditorForm)
            .at(0)
            .props().data
        ).toEqual({
          _id: "abc",
          title: "bla",
          composer: "bla",
          movements: [
            {
              _id: "a1",
              title: "mov2",
              key: "c_s_m",
              recordings: [
                {
                  _id: "b1",
                  year: 1985,
                  performers: [
                    {
                      name: "guy",
                      type: "piano"
                    }
                  ]
                }
              ]
            }
          ]
        });

        wrapper
          .find(EditorForm)
          .at(0)
          .props()
          .onChange({
            entity: EDITOR_ENTITY_RECORDING,
            data: {
              _id: "b1",
              year: 1985,
              performers: [
                {
                  name: "guy",
                  type: "piano"
                }
              ]
            },
            prop: "performers",
            value: [
              {
                name: "guy",
                type: "piano"
              },
              {
                name: "another guy",
                type: "another instrument"
              }
            ]
          });

        return sleep(100);
      })
      .then(() => {
        expect(successfulUpdate).toHaveBeenNthCalledWith(2, {
          id: "b1",
          performers: [
            {
              name: "guy",
              type: "piano"
            },
            {
              name: "another guy",
              type: "another instrument"
            }
          ]
        });

        expect(
          wrapper
            .find(EditorForm)
            .at(0)
            .props().data
        ).toEqual({
          _id: "abc",
          title: "bla",
          composer: "bla",
          movements: [
            {
              _id: "a1",
              title: "mov2",
              key: "c_s_m",
              recordings: [
                {
                  _id: "b1",
                  year: 1985,
                  performers: [
                    {
                      name: "guy",
                      type: "piano"
                    },
                    {
                      name: "another guy",
                      type: "another instrument"
                    }
                  ]
                }
              ]
            }
          ]
        });

        wrapper
          .find(EditorForm)
          .at(0)
          .props()
          .onChange({
            entity: EDITOR_ENTITY_COMPOSITION,
            data: {
              _id: "abc",
              title: "bla",
              composer: "bla",
              movements: [
                {
                  _id: "a1",
                  title: "mov2",
                  key: "c_s_m",
                  recordings: [
                    {
                      _id: "b1",
                      year: 1985,
                      performers: [
                        {
                          name: "guy",
                          type: "piano"
                        },
                        {
                          name: "another guy",
                          type: "another instrument"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            prop: "composer",
            value: "Beethoven"
          });

        return sleep(100);
      })
      .then(() => {
        expect(successfulUpdate).toHaveBeenNthCalledWith(3, {
          id: "abc",
          composer: "Beethoven"
        });

        expect(
          wrapper
            .find(EditorForm)
            .at(0)
            .props().data
        ).toEqual({
          _id: "abc",
          title: "bla",
          composer: "Beethoven",
          movements: [
            {
              _id: "a1",
              title: "mov2",
              key: "c_s_m",
              recordings: [
                {
                  _id: "b1",
                  year: 1985,
                  performers: [
                    {
                      name: "guy",
                      type: "piano"
                    },
                    {
                      name: "another guy",
                      type: "another instrument"
                    }
                  ]
                }
              ]
            }
          ]
        });
      });
  });

  it("should create children and update inner state correctly", () => {
    const composition = {
      _id: "abc",
      title: "bla",
      composer: "bla",
      movements: [
        {
          _id: "a1",
          title: "mov1",
          key: "c_s_m",
          recordings: [
            {
              _id: "b1",
              year: 1985,
              performers: [
                {
                  name: "guy",
                  type: "piano"
                }
              ]
            }
          ]
        }
      ]
    };

    const onGetComposition = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: composition
      })
    );

    const onCreateMovement = jest.fn(() =>
      Promise.resolve({
        success: true,
        errors: [],
        result: "yes"
      })
    );

    const wrapper = shallow(
      <EditorPage
        {...defaultProps}
        onGetComposition={onGetComposition}
        onCreateMovement={onCreateMovement}
        id={"abc"}
      />
    );

    return sleep(100)
      .then(() => {
        wrapper
          .find(EditorForm)
          .at(0)
          .props()
          .onCreate(EDITOR_ENTITY_MOVEMENT, composition)();

        return sleep(100);
      })
      .then(() => {
        expect(onCreateMovement).toHaveBeenCalledWith({
          parent: composition._id
        });
      });
  });
});
