import UserModel from "@/lib/models/user.model";
import PublicationModel from "@/lib/models/publication-model";
import UnfollowModel from "@/lib/models/unfollow-model";
import HiddenPublicationModel from "@/lib/models/hidden-publication-model";
import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
  extractUnfollowedIds,
  extractPublicationIds,
} from "@/lib/function";

export const GET = async (req, { params }) => {
  try {
    const { user } = params;
    const unfollowedUsers = await UnfollowModel.find({ user });
    const hiddenPublication = await HiddenPublicationModel.find({ user });
    const unfollowedUserIds = extractUnfollowedIds(unfollowedUsers);
    const hiddenPublicationIds = extractPublicationIds(hiddenPublication);
    const userId = req.nextUrl.searchParams.get("userId");
    const query = req.nextUrl.searchParams.get("query");
    const regex = new RegExp(query, "i");
    await validateUserId(user, UserModel);
    let publications;

    if (!userId) {
      publications = await PublicationModel.find({
        competence: regex,
        user: { $nin: [...unfollowedUserIds, user] },
        _id: { $nin: hiddenPublicationIds },
      }).populate({
        path: "user",
        select: "name username image statutProfessionnelle",
      });
    } else {
      publications = await PublicationModel.find({
        competence: regex,
        user: userId,
      }).populate({
        path: "user",
        select: "name username image statutProfessionnelle",
      });
    }
    return createJsonResponse({ publications });
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
