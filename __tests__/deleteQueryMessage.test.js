jest.mock("../models/queryModel"); // mock the Query model

const { deleteQueryMessage } = require("../controllers/adminController");
const Query = require("../models/queryModel");

describe("deleteQueryMessage", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "query123",
      },
      session: {
        userId: "admin456",
      },
    };

    res = {
      redirect: jest.fn(),
    };

    Query.findByIdAndDelete.mockClear();
  });

  it("should delete the query and redirect to admin panel", async () => {
    Query.findByIdAndDelete.mockResolvedValue({ _id: "query123" }); // simulate successful deletion

    await deleteQueryMessage(req, res);

    expect(Query.findByIdAndDelete).toHaveBeenCalledWith("query123");
    expect(res.redirect).toHaveBeenCalledWith(
      "/app/admin/admin456/admin-panel"
    );
  });

  it("should handle error and redirect to /app", async () => {
    Query.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await deleteQueryMessage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/app");
  });
});
