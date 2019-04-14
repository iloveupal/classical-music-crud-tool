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
