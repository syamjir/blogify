jest.mock("../models/queryModel"); // mock Query model
jest.mock("../utils/timeAgo"); // mock timeAgo function

const { getAdminPanel } = require("../controllers/adminController");
const Query = require("../models/queryModel");
const timeAgo = require("../utils/timeAgo");

describe("getAdminPanel", () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {
        isAdmin: true,
        userId: "admin123",
      },
    };

    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };

    Query.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          toObject: () => ({
            _id: "1",
            message: "Test message",
            createdAt: new Date(),
          }),
        },
      ]),
    });

    timeAgo.mockReturnValue("2 minutes ago");
  });

  it("should render admin panel with populated queries and relative time", async () => {
    await getAdminPanel(req, res);

    expect(Query.find).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith("admin", {
      allQuery: [
        {
          _id: "1",
          message: "Test message",
          createdAt: expect.any(Date),
          time: "2 minutes ago",
        },
      ],
      userId: "admin123",
    });
  });

  it("should redirect to login if not admin", async () => {
    req.session.isAdmin = false;

    await getAdminPanel(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/login");
  });

  it("should redirect to /app if an error occurs", async () => {
    Query.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await getAdminPanel(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/app");
  });
});
