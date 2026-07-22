import { getUserById, updateUser, deleteUser } from "@/services/UserService";
import User from "@/models/User";

jest.mock("@/models/User");
jest.mock("@/lib/mongoose", () => jest.fn().mockResolvedValue(true));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("returns user by id omitting password", async () => {
      const mockUser = { _id: "user123", name: "Jane" };
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const user = await getUserById("user123");
      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(user).toEqual(mockUser);
    });
  });

  describe("updateUser", () => {
    it("updates user by id and returns updated user", async () => {
      const mockUpdatedUser = { _id: "user123", name: "Jane Updated" };
      (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      });

      const result = await updateUser("user123", { name: "Jane Updated" });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user123", { name: "Jane Updated" }, { new: true, runValidators: true });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe("deleteUser", () => {
    it("deletes user record by id", async () => {
      const mockDeleted = { _id: "user123", name: "Jane" };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

      const result = await deleteUser("user123");
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("user123");
      expect(result).toEqual(mockDeleted);
    });
  });
});
