const chakram = require("chakram");

describe("COMPOSITION API.", () => {
  it("should add composition, retrieve it, search for it, update it, delete it", () => {
    return chakram
      .post("http://localhost:8080/api/compositions", {
        title: "Hungarian Rhapsody",
        composer: "Liszt"
      })
      .then(({ body }) => {
        expect(body.success).toBe(true);
        return chakram.get(
          `http://localhost:8080/api/compositions/${body.result}`
        );
      })
      .then(({ body }) => {
        expect(body.result.title).toEqual("Hungarian Rhapsody");
        expect(body.result.composer).toEqual("Liszt");
        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"bulgarian"}'
        );
      })
      .then(({ body }) => {
        expect(body.count).toEqual(0);
        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"hungarian"}'
        );
      })
      .then(({ body }) => {
        expect(body.count).toEqual(1);
        expect(body.result[0].title).toEqual("Hungarian Rhapsody");
        expect(body.result[0].composer).toEqual("Liszt");
        expect(body.result[0].movements).toEqual([]);
        return chakram.put(
          `http://localhost:8080/api/compositions/${body.result[0]._id}`,
          {
            composer: "Franz Liszt"
          }
        );
      })
      .then(({ body }) => {
        expect(body.result.updated).toEqual(1);

        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"franz"}'
        );
      })
      .then(({ body }) => {
        expect(body.count).toEqual(1);

        return chakram.delete(
          `http://localhost:8080/api/compositions/${body.result[0]._id}`
        );
      })
      .then(({ body }) => {
        expect(body.result.deleted).toEqual(1);

        return chakram.get("http://localhost:8080/api/compositions");
      })
      .then(({ body }) => {
        expect(body.count).toEqual(0);
      });
  });
});

describe("MOVEMENTS API.", () => {
  it("should allow to add movements, edit them, search, delete", () => {
    let compositionId, movementId1, movementId2;

    return chakram
      .post("http://localhost:8080/api/compositions", {
        title: "Suite Bergamasque",
        composer: "Claude Debussy"
      })
      .then(({ body }) => {
        compositionId = body.result;
        return chakram.post("http://localhost:8080/api/movements", {
          title: "Prelude",
          key: "f",
          parent: compositionId
        });
      })
      .then(({ body }) => {
        expect(body.success).toBe(true);
        movementId1 = body.result;

        return chakram.post("http://localhost:8080/api/movements", {
          title: "Menuet",
          key: "a_m",
          parent: compositionId
        });
      })
      .then(({ body }) => {
        movementId2 = body.result;

        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"bergamasque"}'
        );
      })
      .then(({ body }) => {
        expect(body.result[0].movements).toHaveLength(2);
        expect(body.result[0].movements[0]).toMatchObject({
          title: "Prelude",
          key: "f",
          recordings: []
        });
        expect(body.result[0].movements[1]).toMatchObject({
          title: "Menuet",
          key: "a_m",
          recordings: []
        });
        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"bergamasque","movement":"menuet"}'
        );
      })
      .then(({ body }) => {
        expect(body.result[0].movements).toHaveLength(1);
        expect(body.result[0].movements[0]).toMatchObject({
          title: "Menuet",
          key: "a_m",
          recordings: []
        });

        return chakram.put(
          `http://localhost:8080/api/movements/${movementId1}`,
          {
            title: "Prélude"
          }
        );
      })
      .then(({ body }) => {
        expect(body.result.updated).toEqual(1);

        return chakram.get(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      })
      .then(({ body }) => {
        expect(body.result.movements[0]).toMatchObject({
          title: "Prélude",
          key: "f",
          recordings: []
        });

        return chakram.delete(
          `http://localhost:8080/api/movements/${movementId1}`
        );
      })
      .then(({ body }) => {
        expect(body.result.deleted).toEqual(1);

        return chakram.get(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      })
      .then(({ body }) => {
        expect(body.result).toMatchObject({
          title: "Suite Bergamasque",
          composer: "Claude Debussy",
          movements: [
            {
              title: "Menuet",
              key: "a_m",
              recordings: []
            }
          ]
        });

        return chakram.delete(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      });
  });
});

describe("RECORDINGS API", () => {
  it("should allow to add recordings, edit them, search, delete", () => {
    let compositionId, movementId, recordingId1, recordingId2;

    return chakram
      .post("http://localhost:8080/api/compositions/", {
        title: "Suite Bergamasque",
        composer: "Claude Debussy"
      })
      .then(({ body }) => {
        compositionId = body.result;

        return chakram.post("http://localhost:8080/api/movements/", {
          title: "Clair De Lune",
          key: "c_s_m",
          parent: compositionId
        });
      })
      .then(({ body }) => {
        movementId = body.result;

        return chakram.post("http://localhost:8080/api/recordings/", {
          year: 1999,
          performers: [
            {
              name: "Andrew von Oeyen",
              type: "piano"
            }
          ],
          parent: movementId
        });
      })
      .then(({ body }) => {
        recordingId1 = body.result;

        return chakram.post("http://localhost:8080/api/recordings/", {
          year: 1996,
          performers: [
            {
              name: "Angela Hewitt",
              type: "grand"
            }
          ],
          parent: movementId
        });
      })
      .then(({ body }) => {
        recordingId2 = body.result;

        return chakram.get(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      })
      .then(({ body }) => {
        expect(body.result).toEqual({
          _id: compositionId,
          title: "Suite Bergamasque",
          composer: "Claude Debussy",
          movements: [
            {
              _id: movementId,
              title: "Clair De Lune",
              key: "c_s_m",
              parent: compositionId,
              recordings: [
                {
                  _id: recordingId1,
                  parent: movementId,
                  year: 1999,
                  performers: [
                    {
                      name: "Andrew von Oeyen",
                      type: "piano"
                    }
                  ]
                },
                {
                  _id: recordingId2,
                  parent: movementId,
                  year: 1996,
                  performers: [
                    {
                      name: "Angela Hewitt",
                      type: "grand"
                    }
                  ]
                }
              ]
            }
          ]
        });

        return chakram.get(
          'http://localhost:8080/api/compositions/?search={"text":"bergamasque","year":1996}'
        );
      })
      .then(({ body }) => {
        expect(body.result).toEqual([
          {
            _id: compositionId,
            title: "Suite Bergamasque",
            composer: "Claude Debussy",
            movements: [
              {
                _id: movementId,
                title: "Clair De Lune",
                key: "c_s_m",
                parent: compositionId,
                recordings: [
                  {
                    _id: recordingId2,
                    parent: movementId,
                    year: 1996,
                    performers: [
                      {
                        name: "Angela Hewitt",
                        type: "grand"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]);

        return chakram.put(
          `http://localhost:8080/api/recordings/${recordingId1}`,
          {
            performers: [
              {
                name: "Andrew Oeyen",
                type: "harp"
              }
            ]
          }
        );
      })
      .then(({ body }) => {
        expect(body.result.updated).toEqual(1);

        return chakram.get(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      })
      .then(({ body }) => {
        expect(body.result).toEqual({
          _id: compositionId,
          title: "Suite Bergamasque",
          composer: "Claude Debussy",
          movements: [
            {
              _id: movementId,
              title: "Clair De Lune",
              key: "c_s_m",
              parent: compositionId,
              recordings: [
                {
                  _id: recordingId1,
                  parent: movementId,
                  year: 1999,
                  performers: [
                    {
                      name: "Andrew Oeyen",
                      type: "harp"
                    }
                  ]
                },
                {
                  _id: recordingId2,
                  parent: movementId,
                  year: 1996,
                  performers: [
                    {
                      name: "Angela Hewitt",
                      type: "grand"
                    }
                  ]
                }
              ]
            }
          ]
        });

        return chakram.delete(
          `http://localhost:8080/api/recordings/${recordingId1}`
        );
      })
      .then(({ body }) => {
        expect(body.result.deleted).toEqual(1);

        return chakram.get(
          `http://localhost:8080/api/compositions/${compositionId}`
        );
      })
      .then(({ body }) => {
        expect(body.result).toEqual({
          _id: compositionId,
          title: "Suite Bergamasque",
          composer: "Claude Debussy",
          movements: [
            {
              _id: movementId,
              title: "Clair De Lune",
              key: "c_s_m",
              parent: compositionId,
              recordings: [
                {
                  _id: recordingId2,
                  parent: movementId,
                  year: 1996,
                  performers: [
                    {
                      name: "Angela Hewitt",
                      type: "grand"
                    }
                  ]
                }
              ]
            }
          ]
        });
      });
  });
});
