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
