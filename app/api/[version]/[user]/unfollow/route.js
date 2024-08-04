import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
} from "@/lib/function";
import UnfollowModel from "@/lib/models/unfollow-model";
import UserModel from "@/lib/models/user.model";

export const POST = async (req, { params }) => {
  try {
    const { user } = params;
    const unfollowedUser = req.nextUrl.searchParams.get("unfollow");

    await validateUserId(user, UserModel);
    const isAlreadyUnfollowed = await UnfollowModel.findOne({
      unfollowedUser,
      user,
    });
    if (!isAlreadyUnfollowed) {
      const data = await UnfollowModel.create({
        unfollowedUser,
        user,
      });
      return createJsonResponse({ unfollowed: true });
    } else {
      return createErrorResponse("This user is already unfollowed", 409);
    }
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
