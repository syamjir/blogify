// queryController.test.js
const { sendMessageToAdmin } = require("../controllers/adminController");
const Query = require("../models/queryModel");

jest.mock("../models/queryModel"); // mock it instead of using the real one

describe("sendMessageToAdmin", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        message: "Test message",
      },
      session: {
        userId: "user123",
      },
      flash: jest.fn(),
    };

    res = {
      redirect: jest.fn(), // mock function
    };

    Query.create.mockClear(); // reset the call history before the next test runs
  });

  it("should create a message and redirect to /app", async () => {
    Query.create.mockResolvedValue({
      message: "Test message",
      userId: "user123",
    });

    await sendMessageToAdmin(req, res);

    expect(Query.create).toHaveBeenCalledWith({
      message: "Test message",
      userId: "user123",
    });
    expect(res.redirect).toHaveBeenCalledWith("/app");
  });

  it("should handle failure to create message and redirect", async () => {
    Query.create.mockResolvedValue(null);

    await sendMessageToAdmin(req, res);

    expect(Query.create).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith("/app");
  });

  it("should catch error, flash error message, and redirect", async () => {
    Query.create.mockRejectedValue(new Error("DB error"));

    await sendMessageToAdmin(req, res);

    expect(req.flash).toHaveBeenCalledWith(
      "sendMessageError",
      "Please write your message or log in to the app"
    );
    expect(res.redirect).toHaveBeenCalledWith("/app");
  });
});
